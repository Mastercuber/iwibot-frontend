import {
  ChangeDetectorRef,
  Component,
  OnInit,
  NgZone
} from '@angular/core';
import * as $ from 'jquery';
import { ConversationService } from '../shared/services/conversation.service';
import { SpeechToTextService } from '../shared/services/speech-to-text-service.service';
import { SpeechNotification } from '../shared/models/speech-notification';
import { SpeechError } from '../shared/models/speech-error';
import { TextToSpeechService } from '../shared/services/text-to-speech.service';
import { Message } from '../shared/models/message';

export interface IWindow extends Window {
  webkitSpeechRecognition: any;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  public isSpeechRecognitionSupported: boolean = SpeechToTextService.isSpeechRecognitionSupported();
  public isSpeechSynthesisSupported: boolean = TextToSpeechService.isSpeechSynthesisSupported();
  public chatInputFieldPlaceholder = 'Frag mich etwas...';
  public chatInputFieldPlaceholderRecognizing = 'Zuhören aktiv...';
  public recognizing = false;
  public finalTranscript = '';
  notification: string;

  constructor(
    public conversationService: ConversationService,
    private changeDetector: ChangeDetectorRef,
    private speechRecognizer: SpeechToTextService,
    private speechSynthesis: TextToSpeechService,
    private zone: NgZone
  ) {
    this.initRecognition();
    this.initSpeechSynthesis();
    this.initChatScrollHandler();
  }

  ngOnInit() {
  }

  public startVoiceRecognition(event): void {
    if (event instanceof TouchEvent) {
      event.preventDefault();
    }
    this.speechSynthesis.stopSpeech();
    this.speechRecognizer.start();
    $('#chatInputField').attr('placeholder', this.chatInputFieldPlaceholderRecognizing);
  }

  public stopVoiceRecognition(event?): void {
    if (event instanceof TouchEvent) {
      event.preventDefault();
    }
    this.speechRecognizer.stop();
    this.recognizing = false;
  }

  private initRecognition(): void {
    if (!this.isSpeechRecognitionSupported) {
      console.warn('speech recognition is not supported!');
      return;
    }
    this.speechRecognizer.onStart()
      .subscribe(data => {
        this.recognizing = true;
        this.detectChanges();
      });

    this.speechRecognizer.onEnd()
      .subscribe(() => {
        this.stopVoiceRecognition();
        const chatInputField = $('#chatInputField');
        this.zone.run(() => this.sendMessage(this.finalTranscript));
        this.finalTranscript = '';
        this.detectChanges();
        chatInputField.val('');
        chatInputField.attr('placeholder', this.chatInputFieldPlaceholder);

      });
    this.speechRecognizer.onResult()
      .subscribe((data: SpeechNotification) => {
        const message = data.content.trim();
        if (data.info === 'final_transcript' && message.length > 0) {
          this.finalTranscript = message;
          this.detectChanges();
        }
        if (data.info === 'interim_transcript' && message.length > 0) {
          this.finalTranscript = message;
          this.detectChanges();
        }
      });

    this.speechRecognizer.onError()
      .subscribe(data => {
        switch (data.error) {
          case SpeechError.BLOCKED:
          case SpeechError.NOT_ALLOWED:
            this.notification = `Cannot run the demo.
            Your browser is not authorized to access your microphone. Verify that your browser has access to your microphone and try again.
            `;
            break;
          case SpeechError.NO_SPEECH:
            this.notification = `No speech has been detected. Please try again.`;
            break;
          case SpeechError.NO_MICROPHONE:
            this.notification = `Microphone is not available. Please verify the connection of your microphone and try again.`;
            break;
          default:
            this.notification = null;
            break;
        }
        this.recognizing = false;
        this.detectChanges();
      });
  }

  /**
   * Initializes the speech synthesis
   *
   * Subscribes to the newMessageSubject and if the emitted message is
   * a message from the conversation service it starts the speech synthesis
   */
  private initSpeechSynthesis(): void {
    if (!this.isSpeechSynthesisSupported) {
      return;
    }
    this.conversationService.getNewMessageSubject()
      .subscribe((message: Message) => {
          if (!message.getIsSendMessage()) {
            if (message.getLanguage() != null) {
              this.speechSynthesis.speak(message.getPayload(), message.getLanguage());
              return;
            }
            this.speechSynthesis.speak(message.getPayload());
          }
        }
      );
  }

  /**
   * Send a message to the conversation service
   * @param {string} message
   */
  public sendMessage(message: string): void {
    if (message.length === 0) {
      return;
    }
    this.speechSynthesis.stopSpeech();
    this.conversationService.sendMessage(message);
    $('#chatInputField').val('');
  }

  /**
   * Subscribes to the NewMessageSubject and scrolls the chat to the bottom if
   * a new message arrives. It also scrolls to the bottom if the screen gets resized.
   */
  private initChatScrollHandler(): void {
    this.conversationService.getNewMessageSubject().subscribe(data => {
      this.scrollChatToBottom();
    });
    window.onresize = () => {
      this.scrollChatToBottom();
    };
    $(() => {
      this.scrollChatToBottom();
    });
  }

  /**
   * Scrolls the Chat to the Bottom
   */
  private scrollChatToBottom(): void {
    const chat = $('.chat');
    chat.animate({scrollTop: chat.prop('scrollHeight')}, 'slow');
  }

  private detectChanges(): void {
    this.changeDetector.detectChanges();
  }

  public deleteHistory(): void {
    this.conversationService.deleteHistory();
  }
}

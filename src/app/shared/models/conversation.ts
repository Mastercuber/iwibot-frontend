import { Message } from './message';
import { UserInformation } from './user-information';

export class Conversation {

  private context: Object = {};
  private messages: Message[];
  private userInformation: UserInformation;

  constructor() {
    this.messages = [];
  }

  public getMessages(): Message[] {
    return this.messages;
  }

  public addMessage(message: Message): void {
    this.messages.push(message);
  }

  public getContext(): Object {
    return this.context;
  }

  public setContext(context: Object): void {
    this.context = context;
  }

  public getUserInformation(): UserInformation {
    return this.userInformation;
  }

  public setUserInformation(userInformation: UserInformation) {
    this.userInformation = userInformation;
  }
}

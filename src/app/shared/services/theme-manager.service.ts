import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeManagerService {

  isDarkTheme = true;

  constructor() {
    this.setThemeFromLocalStorage();
    this.saveCurrentTheme();
  }

  /**
   * Toggle between themes
   * @returns void
   */
  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
  }

  /**
   * Saves the current selected theme to the local storage before the page is closed.
   * @returns void
   */
  saveCurrentTheme() {
    window.onbeforeunload = () => {
      window.localStorage.setItem('isDarkTheme', String(this.isDarkTheme));
    };
  }

  /**
   * Sets isDarkTheme to the value from local storage if it is set.
   * @returns void
   */
  setThemeFromLocalStorage() {
    const theme = window.localStorage.getItem('isDarkTheme');
    if (theme) {
      this.isDarkTheme = (theme === 'true');
    }
  }

  darkTheme(): boolean {
    return this.isDarkTheme;
  }

}


// import AbstractView from "./AbstractView.js";
// import { verify2FA } from "../scripts/verify2fa.js";

// export default class extends AbstractView {
//   constructor() {
//     super();
//     this.setTitle("satori - verify 2FA");
//   }

//   async getHtml() {
//     return (await fetch("static/html/verify2fa.html")).text();
//   }

//   loadJS() {
//     verify2FA();
//   }

//   stopJS() {}
// }
import AbstractView from "./AbstractView.js";
import { verify2FA } from "../scripts/verify2fa.js";

export default class Verify2FAView extends AbstractView {
  constructor() {
    super();
    this.setTitle("satori - verify 2FA");
  }

  getHtml(): Promise<string> {
    return fetch("static/html/verify2fa.html").then((res) => res.text());
  }

  loadJS(): void {
    verify2FA();
  }

  stopJS(): void {
    // No loop in this view
  }
}

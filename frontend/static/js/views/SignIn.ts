

import AbstractView from "./AbstractView.js";
import { signIn } from "../scripts/signIn.js";



export default class SignInView extends AbstractView  {
	constructor() {
		super();
		this.setTitle("satori - sign in");
	}

	getHtml(): Promise<string> {
		return fetch("static/html/signIn.html").then((res) => res.text());
	}

	loadJS(): void {
		signIn();
	}

	stopJS(): void {
		// No loop in this view
	}
}

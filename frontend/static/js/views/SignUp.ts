
import AbstractView from "./AbstractView.js";
import { signUp } from "../scripts/signUp.js";



export default class SignUpView extends AbstractView {
	constructor() {
		super();
		this.setTitle("satori - sign up");
	}

	getHtml(): Promise<string> {
		return fetch("static/html/signUp.html").then((res) => res.text());
	}
///????????
	loadJS(): void {
		// @ts-ignore: JS function
		signUp();
	}

	stopJS(): void {
		// No loop in this view
	}
}

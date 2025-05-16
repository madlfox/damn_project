import AbstractView from "./AbstractView.js";
import { signIn } from "../scripts/signIn.js";

export default class SignInView extends AbstractView {
    constructor() {
        super();
        this.setTitle("satori - sign in");
    }

    async getHtml(): Promise<string> {
        const res = await fetch("/static/html/signIn.html");
        if (!res.ok) {
            throw new Error(`Failed to load view: ${res.statusText}`);
        }
        return res.text();
    }

    async loadJS(): Promise<void> {
        await signIn(); // <-- Await the execution
    }

    stopJS(): void {
        // No loop in this view
    }
}

// import AbstractView from "./AbstractView.js";
// import { signIn } from "../scripts/signIn.js";

// export default class extends AbstractView {
//     constructor() {
//         super();
//         this.setTitle("satori - sign in");
//     }

//     async getHtml() {
// 		return (await fetch("static/html/signIn.html")).text();
//     }
	
// 	loadJS() {
// 		signIn();
// 	}

//   stopJS(){
// 		// No loop in this view
// 	}

// }
import AbstractView from "./AbstractView.js";
import { signIn } from "../scripts/signIn.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("satori - sign in");
    }

    async getHtml() {
        try {
            const response = await fetch("static/html/signIn.html");
            if (!response.ok) {
                console.error(`Failed to load HTML: ${response.statusText}`);
                return `<div class="error">Failed to load the page</div>`;
            }
            return await response.text();
        } catch (error) {
            console.error("Error loading HTML:", error);
            return `<div class="error">An unexpected error occurred.</div>`;
        }
    }

    loadJS() {
        document.addEventListener("DOMContentLoaded", () => {
            signIn();
        });
    }

    stopJS() {
        window.removeEventListener("DOMContentLoaded", signIn);
    }
}

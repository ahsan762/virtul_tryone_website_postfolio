function initTyping() {
    const typedElement = document.querySelector('#typingText');
    if (!typedElement) return;

    const strings = [
        "AI Website Developer",
        "Full Stack Developer",
        "Graphic Designer",
        "Facebook Marketing Expert",
        "Virtual Try-On Specialist"
    ];

    const typing = new TypingEffect(typedElement, strings, {
        typeSpeed: 80,
        deleteSpeed: 50,
        pauseDuration: 2000,
        loop: true
    });

    typing.start();
}

class TypingEffect {
    constructor(element, strings, options = {}) {
        this.element = element;
        this.strings = strings;
        this.typeSpeed = options.typeSpeed || 80;
        this.deleteSpeed = options.deleteSpeed || 50;
        this.pauseDuration = options.pauseDuration || 2000;
        this.loop = options.loop !== undefined ? options.loop : true;

        this.stringIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.isPaused = false;
        this.isRunning = false;
    }

    type() {
        if (!this.isRunning) return;

        const currentString = this.strings[this.stringIndex];

        if (this.isDeleting) {
            this.charIndex--;
        } else {
            this.charIndex++;
        }

        this.element.textContent = currentString.substring(0, this.charIndex);

        let delay = this.isDeleting ? this.deleteSpeed : this.typeSpeed;

        if (!this.isDeleting && this.charIndex === currentString.length) {
            delay = this.pauseDuration;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.stringIndex = (this.stringIndex + 1) % this.strings.length;

            if (!this.loop && this.stringIndex === 0) {
                this.stop();
                return;
            }

            delay = 500;
        }

        setTimeout(() => this.type(), delay);
    }

    start() {
        this.isRunning = true;
        this.type();
    }

    stop() {
        this.isRunning = false;
    }
}

//#region node_modules/.nitro/vite/services/ssr/assets/audio-DtgDOpK1.js
var KEY = "od_audio_settings";
var audio = {
	ctx: null,
	masterGain: null,
	musicGain: null,
	sfxGain: null,
	musicTimer: null,
	settings: {
		master: .8,
		music: .35,
		sfx: .7,
		muted: false
	},
	load() {
		if (typeof window === "undefined") return;
		try {
			const raw = localStorage.getItem(KEY);
			if (raw) this.settings = {
				...this.settings,
				...JSON.parse(raw)
			};
		} catch {}
	},
	save() {
		if (typeof window === "undefined") return;
		localStorage.setItem(KEY, JSON.stringify(this.settings));
	},
	init() {
		if (typeof window === "undefined" || this.ctx) return;
		const Ctor = window.AudioContext || window.webkitAudioContext;
		if (!Ctor) return;
		this.ctx = new Ctor();
		this.masterGain = this.ctx.createGain();
		this.musicGain = this.ctx.createGain();
		this.sfxGain = this.ctx.createGain();
		this.musicGain.connect(this.masterGain);
		this.sfxGain.connect(this.masterGain);
		this.masterGain.connect(this.ctx.destination);
		this.apply();
	},
	apply() {
		if (!this.masterGain || !this.musicGain || !this.sfxGain) return;
		const m = this.settings.muted ? 0 : this.settings.master;
		this.masterGain.gain.value = m;
		this.musicGain.gain.value = this.settings.music;
		this.sfxGain.gain.value = this.settings.sfx;
		this.save();
	},
	resume() {
		this.init();
		if (this.ctx?.state === "suspended") this.ctx.resume();
	},
	tone(freq, dur, type = "sine", gain = .3, slideTo) {
		this.init();
		if (!this.ctx || !this.sfxGain) return;
		const t = this.ctx.currentTime;
		const osc = this.ctx.createOscillator();
		const g = this.ctx.createGain();
		osc.type = type;
		osc.frequency.setValueAtTime(freq, t);
		if (slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), t + dur);
		g.gain.setValueAtTime(1e-4, t);
		g.gain.exponentialRampToValueAtTime(gain, t + .01);
		g.gain.exponentialRampToValueAtTime(1e-4, t + dur);
		osc.connect(g);
		g.connect(this.sfxGain);
		osc.start(t);
		osc.stop(t + dur + .05);
	},
	noise(dur, gain = .4, filterFreq = 800, type = "lowpass") {
		this.init();
		if (!this.ctx || !this.sfxGain) return;
		const t = this.ctx.currentTime;
		const buf = this.ctx.createBuffer(1, this.ctx.sampleRate * dur, this.ctx.sampleRate);
		const data = buf.getChannelData(0);
		for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
		const src = this.ctx.createBufferSource();
		src.buffer = buf;
		const filter = this.ctx.createBiquadFilter();
		filter.type = type;
		filter.frequency.value = filterFreq;
		const g = this.ctx.createGain();
		g.gain.value = gain;
		src.connect(filter);
		filter.connect(g);
		g.connect(this.sfxGain);
		src.start(t);
	},
	play(name) {
		if (this.settings.muted) return;
		this.init();
		switch (name) {
			case "click":
				this.tone(520, .06, "square", .12);
				break;
			case "shot":
				this.tone(180, .25, "sawtooth", .25, 60);
				this.noise(.2, .2, 1200);
				break;
			case "miss":
				this.noise(.5, .35, 500);
				this.tone(160, .3, "sine", .12, 90);
				break;
			case "hit":
				this.noise(.7, .6, 400);
				this.tone(90, .5, "sawtooth", .4, 40);
				break;
			case "sunk":
				this.noise(1.4, .7, 300);
				this.tone(70, 1.2, "sawtooth", .5, 30);
				setTimeout(() => this.tone(420, .8, "square", .12, 200), 300);
				break;
			case "radar":
				this.tone(1200, .12, "sine", .18, 1600);
				setTimeout(() => this.tone(1400, .12, "sine", .14, 1800), 140);
				break;
			case "siren":
				this.tone(700, .7, "triangle", .15, 400);
				break;
			case "victory":
				[
					523,
					659,
					784,
					1047
				].forEach((f, i) => setTimeout(() => this.tone(f, .4, "triangle", .25), i * 160));
				break;
			case "defeat": [
				400,
				330,
				260,
				180
			].forEach((f, i) => setTimeout(() => this.tone(f, .5, "sawtooth", .2), i * 200));
		}
	},
	startMusic() {
		this.init();
		if (!this.ctx || this.musicTimer || this.settings.muted) return;
		const scale = [
			110,
			146.83,
			164.81,
			196,
			220,
			261.63
		];
		let step = 0;
		const tick = () => {
			if (!this.ctx || !this.musicGain) return;
			const t = this.ctx.currentTime;
			const base = scale[step % scale.length];
			[
				base,
				base * 1.5,
				base * 2
			].forEach((f, i) => {
				const osc = this.ctx.createOscillator();
				const g = this.ctx.createGain();
				osc.type = i === 0 ? "sine" : "triangle";
				osc.frequency.value = f;
				g.gain.setValueAtTime(1e-4, t);
				g.gain.exponentialRampToValueAtTime(.09 / (i + 1), t + .8);
				g.gain.exponentialRampToValueAtTime(1e-4, t + 3.4);
				osc.connect(g);
				g.connect(this.musicGain);
				osc.start(t);
				osc.stop(t + 3.6);
			});
			step++;
		};
		tick();
		this.musicTimer = setInterval(tick, 3200);
	},
	stopMusic() {
		if (this.musicTimer) clearInterval(this.musicTimer);
		this.musicTimer = null;
	}
};
//#endregion
export { audio as t };

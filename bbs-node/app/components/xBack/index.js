const STATE = 'x-back';
let element = document.createElement('span');

const xBack = {
	onPopState(event) {
		let that = this;
		event.state === STATE && that.fire();
	},

	record(state) {
		history.pushState(state, null, location.href);
	},

	fire() {
		var event = document.createEvent('Events');
		event.initEvent(STATE, false, false);
		element.dispatchEvent(event);
	},

	listen(listener) {
		element.addEventListener(STATE, listener, false);
	},

	init() {
		let that = this;
		window.addEventListener('popstate', that.onPopState.bind(this));
		that.record(STATE);
	}
};

export default xBack;
import dateFormat from 'dateformat';
import Time from 'time.js';

const minix = {
	methods: {
		format(time) {
			if (!time) {
				return '-------------';
			}

			return dateFormat(time, 'yyyy/mm/dd HH:mm:ss');
		},
		ago(time) {
			if (!time) {
				return '-------------';
			}

			return Time.ago(time);
		}
	}
};

export default minix;
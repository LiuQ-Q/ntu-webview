import dateFormat from 'dateformat';

const minix = {
	methods: {
		format(time) {
			if (!time) {
				return '-------------';
			}

			return dateFormat(time, 'yyyy/mm/dd HH:mm:ss');
		}
	}
};

export default minix;
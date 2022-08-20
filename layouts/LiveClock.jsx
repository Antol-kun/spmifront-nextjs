import React from "react";
import Clock from 'react-live-clock';

export default function MyQuotesSlider() {
return (
	<div>
	<Clock
		format={'HH:mm:ss'}
		ticking={true} />
	</div>
);
}

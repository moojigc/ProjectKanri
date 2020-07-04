import React from "react";

const Wrapper = ({ children, style }) => {
	return (
		<div style={style} className="wrapper">
			{children}
		</div>
	);
};

export default Wrapper;

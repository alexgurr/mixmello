import ReactTooltip from 'react-tooltip';

export default function Tooltip({ id, text, place = 'top', delayShow, children, hide }) {
	if (hide || !id) { return children; }
	
	return (
		<>
			<div style={{ display: 'flex' }} data-tip={id} data-for={id}>
				{children}
			</div>
			<ReactTooltip
				id={id}
				place={place}
				effect="solid"
				backgroundColor="#FFF"
				textColor="#264653"
				delayShow={delayShow}
				multiline
				border
				borderColor="black"
			>
				{text}
			</ReactTooltip>
		</>
	)
}
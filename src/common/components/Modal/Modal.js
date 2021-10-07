import Rodal from 'rodal';
import cx from 'classnames';
import { useEffect } from 'react';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import { Button, Text } from '../';
import './_modal.scss';

export default function Modal({
	children,
	title,
	visible,
	onClose,
	className,
	width = 500,
	subtitle,
	stayOpen,
	hideCancel,
	saveProps,
	cancelProps = {}
}) {
	useEffect(() => {
		if (!visible) {
			return void enableBodyScroll(document.body);
		}
		
		disableBodyScroll(document.body);
	}, [visible]);
	
	return (
		<Rodal
			visible={visible}
			onClose={onClose}
			className="modal"
			closeOnEsc={!stayOpen}
			showCloseButton={false}
			width={width}
			closeMaskOnClick={!stayOpen}
		>
			<div className="modal__header">
				<div>
					<Text heading className="mt-0 mb-0">{title}</Text>
					{subtitle ? <Text className="mt-10">{subtitle}</Text> : null}
				</div>
				{!stayOpen ? <Button type="icon-only" icon="fa-times" onClick={onClose} /> : null}
			</div>
			<div className={cx('modal__content', className)}>
				{children}
			</div>
			{
				(hideCancel || stayOpen) && !saveProps
					? null
					: (
						<div className="modal__footer">
							{
								!hideCancel ? (
										<Button
											type="secondary"
											{...cancelProps}
											onClick={cancelProps.onClick || onClose}
											id="modal-cancel-btn"
										>
											{cancelProps.children || 'Cancel'}
										</Button>
									)
									: null
							}
							{
								saveProps ? (
										<Button
											{...saveProps}
											id="modal-save-btn"
										>
											{saveProps?.children || 'Save'}
										</Button>
									)
									: null
							}
						</div>
					)
			}
		</Rodal>
	);
}
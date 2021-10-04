import cx from 'classnames';
import { Button } from 'common/components';
import '../styles/_pagination.scss';

export default function Pagination({
	className,
	page,
	nextPage,
	previousPage,
	atCeiling,
	atFloor,
	totalPages,
	setPage
}) {
	if (totalPages === 1) { return null; }
	
	const onSpecificPage = number => () => {
		setPage(number);
	}

	return (
		<div className={cx('pagination', className)}>
			<Button disabled={atFloor} type="icon-only" icon="faArrowAltCircleLeft" onClick={previousPage} />
			{[...new Array(totalPages)].map((_, index) => (
				<a
					onClick={onSpecificPage(index + 1)}
					className={cx('pagination__number', { 'pagination__number--current': page === index + 1 })}
				>
					{index + 1}
				</a>
			))}
			<Button disabled={atCeiling} type="icon-only" icon="faArrowAltCircleRight" onClick={nextPage} />
		</div>
	)
}
import { useEffect } from 'react';
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
	useEffect(() => {
		window.scrollTo({ top: 0 });
	}, [page])
	
	if (totalPages === 1) { return null; }
	
	const onSpecificPage = number => () => {
		setPage(number);
	}
	
	return (
		<div className={cx('pagination', className)}>
			<Button disabled={atFloor} type="icon-only" icon="fa-chevron-left" onClick={previousPage} iconSize={20} />
			<div className="pagination__numbers">
				{[...new Array(totalPages)].map((_, index) => (
					<a
						onClick={onSpecificPage(index + 1)}
						className={cx('pagination__number', { 'pagination__number--current': page === index + 1 })}
					>
						{index + 1}
					</a>
				))}
			</div>
			<Button disabled={atCeiling} type="icon-only" icon="fa-chevron-right" onClick={nextPage} iconSize={20} />
		</div>
	)
}
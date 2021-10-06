import { useBooleanState } from 'webrix/hooks'
import searchMovies from '../api/getMovies';
import { Button, Dropdown, Text } from 'common/components';
import { useMediaQuery } from 'react-responsive';
import '../styles/_search.scss';
import getMovieUrl from '../utils/getMovieUrl';

export default function Search({ onSelectMovie, selectedMovie, onContinue }) {
	const { value: busy, setTrue: setBusy, setFalse: setNotBusy } = useBooleanState();
	const isMobile = useMediaQuery({ maxWidth: 700 });
	
	const handleContinue = async () => {
		setBusy();
		
		try {
			await onContinue();
		} catch {
			setNotBusy();
		}
	};
	
	return (
		<div className="search">
			<Text subHeading>What movie are we grooving to?</Text>
			<Text>You’ll be able to confirm the soundtrack in the next step.</Text>
			<div className="search__search-input">
				<Dropdown
					async
					cacheOptions
					onChange={onSelectMovie}
					placeholder="Search movies ..."
					loadOptions={searchMovies}
					noOptionsMessage={({ inputValue }) => !inputValue ? 'Ready to search.' : 'No matching movies, try changing your search.'}
					loadingMessage={() => 'Finding movies ...'}
					styles={{
						container: () => ({ height: isMobile ? 50 : 75 }),
						control: (_, { hasValue }) => ({ height: isMobile ? 50 : 75, fontSize: hasValue || isMobile ? void 0 : 20, paddingLeft: isMobile ? 5 : 20 }),
						indicatorsContainer: (base, { selectProps: { isLoading } }) => isMobile ? base : ({ ...base, width: isLoading ? 151 : 75, minWidth: 75 }),
						dropdownIndicator: (base) => isMobile ? base : ({ ...base, margin: 'auto', svg: { width: 30, height: 30 } }),
						menuList: base => ({ ...base, maxHeight: document.body.getBoundingClientRect().height / 3 }),
						loadingIndicator: base => ({ ...base, marginLeft: 20, marginRight: 20 })
					}}
					getOptionLabel={option => (
						<div style={{ display: 'flex', alignItems: 'center' }}>
							{
								option.poster_path
									? <img src={getMovieUrl(option)} width={50} height={50} style={{ borderRadius: '50%', marginRight: 10, minWidth: 50 }} />
									: <div style={{ width: '50px', height: '50px', background: 'lightgrey', borderRadius: '50%', marginRight: 10 }} />
							}
							<Text className="mt-0 mb-0"><strong>{option.title}</strong></Text>
						</div>
					)}
					getOptionValue={option => option.id}
				/>
			</div>
			<Button busy={busy} disabled={!selectedMovie} className="mt-40" onClick={handleContinue}>Get My Soundtrack</Button>
		</div>
	);
}
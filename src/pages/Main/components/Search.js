import { useBooleanState } from 'webrix/hooks'
import searchMusic from '../api/getPlaylists';
import '../styles/_search.scss';
import { Button, Dropdown, Text } from 'common/components';
import { useMediaQuery } from 'react-responsive';

export default function Search({ token, onSelectPlaylist, selectedPlaylist, onRemix }) {
	const { value: busy, setTrue: setBusy, setFalse: setNotBusy } = useBooleanState();
	const isMobile = useMediaQuery({ maxWidth: 700 });
	
	const handleRemix = async () => {
		setBusy();
		
		try {
			await onRemix();
		} catch {
			setNotBusy();
		}
	};
	
	return (
		<div className="search">
			<Text subHeading>What playlist are we remixing?</Text>
			<Text>You’ll be able to customise your remixes in the next step.</Text>
			<div className="search__search-input">
				<Dropdown
					async
					cacheOptions
					onChange={onSelectPlaylist}
					placeholder="Search your playlists ..."
					loadOptions={searchMusic(token)}
					noOptionsMessage={({ inputValue }) => !inputValue ? 'Ready to search.' : 'No matching playlists, try changing your search.'}
					loadingMessage={() => 'Finding your playlists ...'}
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
								option.images?.[0]?.url
									? <img src={option.images?.[0]?.url} width={40} height={40} style={{ borderRadius: '50%', marginRight: 20 }} />
									: <div style={{ width: '40px', height: '40px', background: 'lightgrey', borderRadius: '50%', marginRight: 20 }} />
							}
							<div>
								<Text className="mt-0 mb-5"><strong>{option.name}</strong></Text>
								<Text className="mt-0 mb-0">{option.public ? 'Public' : 'Private'} playlist</Text>
							</div>
						</div>
					)}
					getOptionValue={option => option.id}
				/>
			</div>
			<Button busy={busy} disabled={!selectedPlaylist} className="mt-40" onClick={handleRemix}>Remix Playlist</Button>
		</div>
	);
}
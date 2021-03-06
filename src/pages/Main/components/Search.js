import { useBooleanState } from 'webrix/hooks'
import searchMusic from '../api/getPlaylists';
import '../styles/_search.scss';
import { Button, Dropdown, Icon, Text, Toggle } from 'common/components';
import { useMediaQuery } from 'react-responsive';

export default function Search({ token, onSelectPlaylist, selectedPlaylist, onRemix, setAcousticRemix }) {
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
			<Text className="mt-0 mb-30">You’ll be able to customise your remixes in the next step.</Text>
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
						<div className="search__option-label">
							{
								option.images?.[0]?.url
									? <img className="search__option-label__avatar" alt="playlist-art" src={option.images?.[0]?.url} />
									: (
										<div className="search__option-label__avatar">
											<Icon name="fa-stream" size={15} />
										</div>
									)
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
			<Toggle className="mt-30" label="Remix with acoustic tracks" onChange={setAcousticRemix} />
			<Button busy={busy} disabled={!selectedPlaylist} className="mt-10" onClick={handleRemix}>Remix Me A Playlist</Button>
		</div>
	);
}
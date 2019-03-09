tell application "Spotify"
	set theTrack to current track
	set theID to id of theTrack
	
	set textFile to "/Users/jamescollins/Desktop/repositories/spotify-philips-hue-album-sync/songIdLog.txt"
	
	do shell script "echo  " & quoted form of theID & " >  " & quoted form of textFile
end tell


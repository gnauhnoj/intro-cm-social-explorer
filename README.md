# intro-cm-social-explorer (Spring 2015)
## Web App
Test out the Last-Gram-Dash App online: [https://last-gram-dash.herokuapp.com/](https://last-gram-dash.herokuapp.com/)

## Team Members
Jonathan Huang
Muhammad Khadafi

## Explanation
###O verall Idea:
A 3 month recap for Last.fm users to see their listening statistics (total count of songs and minutes listened, top artists, top songs). Performs an Instagram analysis of a user's top Artists to see how the user's listening ranking compares to relative Instagram popularity (as judged by [likes + comments]/posts).

### APIs Used:
Last.fm, Instagram

### Stack:
Node, Angluar, MongoDB, Bootstrap

### How it works:
##### Last.fm OAuth Login
Users login to their last.fm account through a standard oauth flow. Once the user is authenticated they proceed to last.fm data retrieval. At this step, any prior data for the user is cleared from the database.

##### Last.fm API Retrieval
The app fetches the user's top artist and top songs for the last 3 months. This is done by using the last.fm getTopArtists and getTopTracks API endpoints and handling pagination. A slight transformation is applied to translate retrieved song length into minutes (from seconds) before saving. This information is then collected and saved to the MongoDB database (for the logged in user). Once all the song information is collected and saved, the server redirects to Instagram API retrieval

##### Instagram API Retrieval
The Instagram API is used in two different ways. First, we take the top ten artist names gathered from the Last.fm API and search for their Instagram ID based on their concatenated full name. For the purposes of this implementation, we assume that the artist will have the most relevant result, which means taht we take the first result of the user search API call. Once we get the Instagram ID, we get all of the ten artist's instagram posts from the past 3 months, we w up the number of likes and comments for each post, and we store them into the artist database as an attribute for that particular artist. Once all the Instagram information is collected and saved, the server redirects to a report compilation route on the server.

##### Statistic Collection
Once all the API data has been collected for the user, we build the user's report by doing the following:

- Sort all songs/artists by playcount in the database. Save the top 10 for each category along with: playcount, artist, title (if applicable)

- For the top 10 artists, save the instagram statistics

- By iterating through all the songs, calculate the total songs and minutes played for the user

- Once the report entry is saved to the database, the server serves the front end app.

##### Front End Display
The app's front end is built in Angular and Bootstrap. Angular was chosen to flexibly display the data collected by utilizing Angular's data binding. On the front end, we collect the Instagram statistics for the top 10 artists, create a ranking for the artists based on their relative popularity, and calculate the discrepancy between their instagram ranking and their listening frequency ranking.

NOTE: user -> restaurant

How to keep user login?
each time user logins we save it's _id, restaurantName and token in cookies. then we find other information from servers using this cookies

How do user log out?
We just delete the cookies and refresh the page.

so the browser initially check for cookies. if no cookies then ask for login, else allow access to /restaurant routes.
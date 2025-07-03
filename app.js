let contacts = []

const res = await fetch('https://api.bird.com/workspaces/' + process.env.WORKSPACE_ID + '/contacts?limit=100', {
	headers: new Headers({
		'Authorization': 'AccessKey ' + process.env.BIRD_KEY,
		})
	})
let currentContacts = await res.json()
contacts = contacts.concat(currentContacts.results)

while (currentContacts.nextPageToken != null) {
	const res = await fetch(`https://api.bird.com/workspaces/${process.env.WORKSPACE_ID}/contacts?limit=100&pageToken=${currentContacts.nextPageToken}`, {
		headers: new Headers({
			'Authorization': 'AccessKey ' + process.env.BIRD_KEY,
		})
	})

 	currentContacts = await res.json()
	contacts = contacts.concat(currentContacts.results)
}

Promise.all(contacts.map(async contact => {
	if (contact.featuredIdentifiers[0].value.includes('tu3')) {
		console.log('Deleting contact: ' + contact.featuredIdentifiers[0].value)
		const res = await fetch(`https://api.bird.com/workspaces/${process.env.WORKSPACE_ID}/contacts/${contact.id}`, {
			method: 'DELETE',
			headers: new Headers({
				'Authorization': 'AccessKey ' + process.env.BIRD_KEY,
			})
		})
		return res.ok
	}
}))
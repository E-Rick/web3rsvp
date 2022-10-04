import { gql } from "@apollo/client";

export const MY_PAST_RSVPS = gql`
	query MyPastRsvps($id: String) {
		account(id: $id) {
			id
			rsvps {
				event {
					id
					name
					eventTimestamp
					imageURL
				}
			}
		}
	}
`

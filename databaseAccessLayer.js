const database = include('/databaseConnection');


async function getAllUsers() {
	let sqlQuery = `
		SELECT restaurant_id, name, description
		FROM restaurant;
	`;

	try {
		const results = await database.query(sqlQuery);
		console.log(results[0]);
		return results[0];
	}
	catch (err) {
		console.log("Error selecting from restaurant table");
		console.log(err);
		return null;
	}
}

async function getRestaurantById(id) {
	let sqlQuery = `
	  SELECT name FROM restaurant WHERE restaurant_id = ?;
	`;
  
	try {
	  const results = await database.query(sqlQuery, [id]);
	  console.log(results[0]);
	  return results[0];
	} catch (err) {
	  console.log("Error selecting from restaurant table");
	  console.log(err);
	  return null;
	}
}

async function getAllReviews() {
	let sqlQuery = `
		SELECT review_id, restaurant_id, reviewer_name, details, rating
		FROM review;
	`;

	try {
		const results = await database.query(sqlQuery);
		console.log(results[0]);
		return results[0];
	}
	catch (err) {
		console.log("Error selecting from review table");
		console.log(err);
		return null;
	}
}

async function addUser(postData) {
	let sqlInsertSalt = `
   INSERT INTO web_user (first_name, last_name, email, password_salt) 
   VALUES (:first_name, :last_name, :email, sha2(UUID(),512));
   `;
	let params = {
		first_name: postData.first_name,
		last_name: postData.last_name,
		email: postData.email
	};
	console.log(sqlInsertSalt);
	try {
		const results = await database.query(sqlInsertSalt, params);
		let insertedID = results.insertId;
		let updatePasswordHash = `
   UPDATE web_user 
   SET password_hash = sha2(concat(:password,:pepper,password_salt),512) 
   WHERE web_user_id = :userId;
   `;
		let params2 = {
			password: postData.password,
			pepper: `${passwordPepper}`,
			userId: insertedID
		}
		console.log(updatePasswordHash);
		const results2 = await database.query(updatePasswordHash, params2);
		return true;
	}
	catch (err) {
		console.log(err);
		return false;
	}
}

async function deleteRestaurant(id) {
	let sqlDeleteUser = `
   DELETE FROM restaurant 
   WHERE restaurant_id = ?;
   `;

   let sqlDeleteReview = `
   DELETE FROM review
   WHERE restaurant_id = ?;
   `
	
	try {
		await database.query(sqlDeleteReview, [id]);
		try {
			await database.query(sqlDeleteUser, [id]);
			return true;
		}
		catch(err) {
			console.log(err);
			return false;
		}
	}
	catch (err) {
		console.log(err);
		return false;
	}
}

async function deleteReview(id) {
	let sqlDeleteUser = `
   DELETE FROM review 
   WHERE review_id = ?;
   `;
	
	try {
		await database.query(sqlDeleteUser, [id]);
		return true;
	}
	catch (err) {
		console.log(err);
		return false;
	}
}

async function getAllReviewsByRestId(restId) {
	let sqlQuery = `
	  SELECT * FROM review WHERE restaurant_id = ?;
	`;
	try {
	  const results = await database.query(sqlQuery, [restId]);
	  console.log(results[0]);
	  return results[0];
	}
	catch (err) {
	  console.log("Error selecting from review table");
	  console.log(err);
	  return null;
	}
}



module.exports = { getAllUsers, addUser, deleteRestaurant, deleteReview, getAllReviewsByRestId, getRestaurantById }



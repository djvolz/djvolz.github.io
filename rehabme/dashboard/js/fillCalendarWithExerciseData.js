

$( document ).ready(function() {
	// Parse credentials (App Id, JavaScript key)
	var AppId 		  = "jix4a7ziO3LTyuL4PZ3IyyRUA7DmnwRO0zvka2z5";
	var JavaScriptKey = "YjcdhUmLeR4w43lx7lYyCmKJZXCXaiZDVADzSCJk";

	// Parse credentials (App Id, JavaScript key)
	Parse.initialize( AppId, JavaScriptKey );

	// Parse object
	var Calendar = Parse.Object.extend( "Calendar" );
	// Query
	var query = new Parse.Query( Calendar );

	var calendarData = [];

	//If the user is successfully logged out then redirect to homepage
	if(!Parse.User.current()) {
		window.location = "/login";
	}
	
	query.find({
		success: function(results) {
				var calObject = results[0];

				parseExercises(calObject);

			},
			error: function(error) {
		        console.log( "Error: " + error.code + " " + error.message );
			}
		});

	// you can filter the data (all entries where skipped is CalfRaises)
	//query.equalTo( "skipped", "CalfRaises" );


	
});



function parseExercises(calObject) {
	// Parse object
	var Exercise = Parse.Object.extend( "Exercise" );
	
	// Query
	var query = new Parse.Query( Exercise );
	
	// order by
	query.descending( "updatedAt" );

	// limit how many entries you would like to query
	// query.limit( 5 );

	var calendarData = [];

	/* Check for null. */
	if(calObject) {
		calendarData = calObject.get('calendarArray');
	} 

	// Actual pending-words finding function
	query.find( {

		success: function( results ) {
			for (var i = 0; i < results.length; i++) {
				var exercise = results[i];

				var performed = exercise.get('performed');
				var skipped   = exercise.get('skipped');
				// var file 	  = exercise.get('imageFile');

				/* Check for null. */
				if(!performed)
					performed = 0;

				calendarData = updateCalendarDataWithDecision(performed, exercise, "event-success", calendarData);


				/* Check for null. */
				if(!skipped)
					skipped = 0;

				calendarData = updateCalendarDataWithDecision(skipped, exercise, "event-important", calendarData);

			}

			saveCalendarObjectWithCalendarData(calObject, calendarData)

		},
	    // Handle errors
	    error: function( error ) {
	        console.log( "Error: " + error.code + " " + error.message );
	    }
   	});
}

function saveCalendarObjectWithCalendarData (calObject, calendarData) {
	/* Save the calendar data to the calendar object. */
	if (calObject) {
		// Parse object
		calObject.set("calendarArray", calendarData);
		calObject.save(null, {
			success: function(calObject) {
				// Execute any logic that should take place after the object is saved.
			},
			error: function(calObject, error) {
				// Execute any logic that should take place if the save fails.
				// error is a Parse.Error with an error code and message.
				console.log('Failed to create new object, with error code: ' + error.message);
			}
		});
	/* If no calendar object is found, create one. */
	} else {
		// Parse object
		var Calendar = Parse.Object.extend( "Calendar" );
		var calData = new Calendar();
			calData.setACL(new Parse.ACL(Parse.User.current()));
			calData.set("calendarArray", calendarData);
			calData.save(null, {
				success: function(calData) {
					// Execute any logic that should take place after the object is saved.
					console.log('New object created with objectId: ' + calData.id);
				},
				error: function(calData, error) {
					// Execute any logic that should take place if the save fails.
					// error is a Parse.Error with an error code and message.
					console.log('Failed to create new object, with error code: ' + error.message);
				}
		});
	}
}


function updateCalendarDataWithDecision (decision, object, eventIcon, calendarData) {
	for (var i = 0; i < decision.length; i++) {

		// get all dates, in the format of 'Sun Mar 29 2015'
		date = decision[i];

		var dateCol = date.getTime();

		/* Used to shape the width of the block in the day view. */
		var timeDelta = 1000000
		
		//TODO: calendar objectID could have a repeat if two objects were created at exact same time
		var calendarObject = {
			"id": dateCol,
			"title": object.get('name'),
			"url": 	'https://files.parsetfss.com/d531c601-ccbe-4b51-b369-7e192864f0a6/tfss-5cd118e6-eaf7-402a-803e-894151548988-hip_abduction.png',
			"class": eventIcon,
			"start": dateCol,
			"end":   dateCol + timeDelta
		}

		if (!containsObject(calendarObject, calendarData)) {
			calendarData.push(calendarObject);
		}
	}

	return calendarData;
}


function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i].id == obj.id) {
            return true;
        }
    }

    return false;
}
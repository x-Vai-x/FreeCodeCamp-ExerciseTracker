


$(document).ready(function(){

		
		alert('loaded')
		find10ExercisesFromPoint(0).then(exercises=>{
		alert("exercises found")
		
		let id=0
		exercises.map(exercise=>{
		
			$('#'+id).val(exercise.Description)
		})

	})
})

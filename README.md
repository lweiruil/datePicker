# datePicker
datePicker with data

### jQuery required

### use case

```
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content=" width=device-width,minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
	<title>日历控件</title>
	<link rel="stylesheet" href="css/datePicker.css">
	<script src="http://code.jquery.com/jquery-3.1.1.min.js"></script>
	<script src="js/datePicker.js"></script>
</head>
<body>
	<script>
		$.calendar({
			maxDate: "2016-09-20",
			minDate: "2014-11-10",
			data : [
				{
					date: "2016-09-01",
					data: "&yen;120"
				},
				{
					date: "2016-09-02",
					data: "&yen;120"
				},
				{
					date: "2016-09-03",
					data: "&yen;120"
				},
				{
					date: "2016-09-04",
					data: "&yen;120"
				}
			],
			selectedDate: "2016-09-15",
			selected: function (date,obj,item) {
				console.log(date);
				console.log(obj);
//				console.log(item);
//				console.log(this);
			}
		});
	</script>
</body>
</html>
```

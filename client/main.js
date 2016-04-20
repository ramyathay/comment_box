var CommentBox = React.createClass({
	getInitialState: function() {
		return {data: []};
	},
	handleCommentSubmit: function(comment) {
		var comments = this.state.data;
		comment.id = Date.now()
		var newComments = comments.concat([comment])
		this.setState({data: newComments})
		$.ajax({
	      url: this.props.url,
	      dataType: 'json',
	      type: 'POST',
	      data: comment,
	      success: function(data) {
	        this.setState({data: data});
	      }.bind(this),
	      error: function(xhr, status, err) {
	      	this.setState({data: comments})
	        console.error(this.props.url, status, err.toString());
	      }.bind(this)
	    });
	},
	componentDidMount: function() {
		$.ajax({
			url: this.props.url,
			dataType: 'json',
			cache: false,
			success: function(data) {
				this.setState({data: data});
			}.bind(this),
			error: function(xhr,status,error) {
				console.error(this.props.url, status, error.toString());
			}.bind(this)
		})
	},	
	render: function() {
		return (
			<div className = "commentBox">
				<h1>Comments</h1>
				<CommentList data = {this.state.data}/>
				<CommentForm  onCommentSubmit = {this.handleCommentSubmit}/>
			</div>
		)
	}
});

var CommentList = React.createClass({
	render: function() {
		var all_comments = this.props.data.map(function(comment){
			return (
				<Comment author= {comment.author} key = {comment.id}>
					{comment.text}
				</Comment>
			) 
		})
		return (
			<div>
				{all_comments}
			</div>
		)
	}
});

var CommentForm = React.createClass({
	getInitialState: function() {
		return {auhor: '', text: ''}
	},
	handleAuthorChange: function(e) {
		this.setState({author: e.target.value})
	},
	handleTextChange: function(e) {
		this.setState({text: e.target.value})
	},
	handleSubmit: function(e) {
		e.preventDefault()
		var author = this.state.author.trim()
		var text = this.state.text.trim()
		if (!text || !author) {
			return;
		}
		//Send request to the server
		// $.ajax({
		// 	type: "POST",
		// 	url: "http://localhost:5000/api/comments",
		// 	data: {'author': this.author,'text': this.text},
		// 	dataType: 'json',
		// 	success: function(data) {
		// 		console.log("Submitted successfully")
		// 	}.bind(this),
		// 	error: function(xhr,status,error) {
		// 		console.error(this.props.url, status, error.toString());
		// 	}.bind(this)
		// })
		this.props.onCommentSubmit({author: author,text: text})
		this.setState({author: '',text: ''})
	},
	render: function() {
		return (
			<form className = "commentForm" onSubmit = {this.handleSubmit}>
				<input type = "text" placeholder = "Name" value = {this.state.author} onChange = {this.handleAuthorChange}/>
				<input type = "text" placeholder = "Your Comment" value = {this.state.text} onChange = {this.handleTextChange}/>
				<input type = "submit" value = "Post" />
			</form>
		);
	}
});

var Comment = React.createClass({
	render: function() {
		return (
			<div className = "comment">
				<h2> {this.props.author} </h2>
				{marked(this.props.children.toString())}
			</div>
		)
		
	}
})

var data = [
  {id: 1, author: "Pete Hunt", text: "This is one comment"},
  {id: 2, author: "Jordan Walke", text: "This is *another* comment"}
];

ReactDOM.render(<CommentBox url = "http://localhost:5000/api/comments"/>,document.getElementById('container'));
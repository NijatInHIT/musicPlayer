import React, {
	Component
} from 'react';

let promise = Promise.resolve();
let searchValue = null;
class SearchMusic extends Component {
	constructor(props) {
		super(props);
		this.changeInput = this.changeInput.bind(this);
		this.clickSearch = this.clickSearch.bind(this);
		this.clickSearchedValue = this.clickSearchedValue.bind(this);
		this.state = {
			searchValue: undefined
		};

	}
	clickSearch(e) {
		if ($(e.target).hasClass('searchDiv') && !$(e.target).hasClass('getCross')) {
			$('.searchSuggest').addClass('searchSuggestShow');
			$('#search').focus();
			$('#search')[0].value = '';
			$('.searchDiv').addClass('searchOpen');
			setTimeout(() => {
				$('.searchDiv').addClass('getCross');
			}, 200);
			$('.searchDiv').append('<span class="clickCross"></span>');
			$('.clickCross').on('click', ((e) => {
				$('.searchDiv').removeClass('getCross');
				setTimeout(() => {
					$('.searchDiv').removeClass('searchOpen');
					$('.searchSuggest').removeClass('searchSuggestShow');
					$('.clickCross').remove();
					this.setState({
						searchValue: undefined
					});
				}, 200);

			}).bind(this));
		}
	}

	clickSearchedValue(e) {
		if (e.target.nodeName === 'P' && e.target.parentNode.childNodes[0].wholeText.indexOf('songs') !== -1) {
			console.log(e.target);
			this.props.tpId(e.target.getAttribute('ids'));
		}
	}


	changeInput(e) {
		if (e.target.value.length > 2) {
			searchValue = e.target.value;
			new Promise((resolve, reject) => {
				$.ajax({
					type: 'get',
					dataType: 'text',
					url: 'http://127.0.0.1:3001',
					data: {
						suggestSearch: searchValue
					},
					success: function(data) {
						data = JSON.parse(data);
						console.log(data);
						resolve(data);
					}
				});
			}).then(data => {
				this.setState({
					searchValue: data
				});
			});
		} else {
			this.setState({
				searchValue: undefined
			});
		}
	}



	render() {
		let retTag = '';
		if (typeof this.state.searchValue === 'object' && this.state.searchValue.result.order) {
			for (let i = 0; i < this.state.searchValue.result.order.length; i++) {
				let newSpan = `<span>${this.state.searchValue.result.order[i]} ➥ `;
				let subData = this.state.searchValue.result[this.state.searchValue.result.order[i]];
				let pTag = '';
				switch (this.state.searchValue.result.order[i]) {
					case 'artists':
						pTag = '';
						for (let j = 0; j < subData.length; j++) {
							pTag += `<p>${subData[j].name}</p>`;
						}
						newSpan += pTag + '</span>';
						break;
					case 'albums':
						pTag = '';
						for (let j = 0; j < subData.length; j++) {
							pTag += `<p>${subData[j].name}---${subData[j].artist.name}</p>`;
						}
						newSpan += pTag + '</span>';
						break;
					case 'playlists':
						pTag = '';
						for (let j = 0; j < subData.length; j++) {
							pTag += `<p>${subData[j].name}</p>`;
						}
						newSpan += pTag + '</span>';
						break;


					default:
						pTag = '';
						for (let j = 0; j < subData.length; j++) {
							pTag += `<p ids=${subData[j].id}>${subData[j].name}---${subData[j].artists[0].name}</p>`;
						}
						newSpan += pTag + '</span>';
				}
				retTag += newSpan;
			}

		} else {
			retTag = '';
		}
		return (
			<div>
			<div className='searchDiv' onClick={this.clickSearch} >
				<input type="text" id='search' onChange={this.changeInput} autoComplete='off'/>
			</div>
			<div className='searchSuggest' dangerouslySetInnerHTML={{__html:retTag}} onClick={this.clickSearchedValue}>

			</div>
			</div>
		)
	}

}


export default SearchMusic
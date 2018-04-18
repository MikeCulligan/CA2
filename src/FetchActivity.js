import React from 'react';
import UserCard from './Components/UserCard';
import DropDown from './Components/DropDown';
import SortRadioButton from './Components/SortRadioButton';
import LabelledInput from './Components/LabelledInput';
import ToggleButton from './Components/ToggleButton';

class FetchActivity extends React.Component {
    constructor() {
        super();
        this.state = {
            users: [],
            genderSelected: 'all',
            nationalitySelected: 'all',
            nationalityValues: [],
            sort: 'no',
            searchText: '',
            contrastMode: false
        };
        //let names = [];
        
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    componentWillMount() {
        // extend this example to deal with 50 users
        // use this URL 'https://randomuser.me/api/?results=50'
        fetch('https://randomuser.me/api?results=50')
        .then(response => {
            if(response.ok) return response.json();
            throw new Error('Request failed.');
        })
        .then(data => {
            console.log(data);
            /*for (let count = 0; count < data.results.length; count++) {
                console.log(data.results[count].name.first);
                names.push(data.results[count].name.first);
            }*/
            /* 
            const list = users.map(user => {
                return (
                    <div style={{'border-style': 'dotted', 'padding': '10px 0px 10px 0px', 'text-align': 'center'}} class="user-list" key={user.id} >
                        <h2>Name: {user.first_name} {user.last_name}</h2>
                        <p>Email Address: {user.email}</p>
                    </div>
                    );
            });
            */
            const users = data.results.map(user => {
                return {name: user.name.first,
                    image: user.picture.large,
                    gender: user.gender,
                    nationality: user.nat};
            });
            this.setState({users: data.results});

            /*const nat = users.map(user => {
                return user.nationality;
            });
            const deduped = [...new Set(nat)];
            deduped.sort();
            this.setState({nationalityValues: deduped});*/
        })
        .catch(error => {
            console.log(error);
        });
    }
    
    handleClick(event) {
        // handle the toggle <button>
        const name = event.target.name;
        this.setState(prevState => ({
            [name]: !prevState[name]
        }));
    }
    
    handleChange(event) {
        
        const genderValue = document.getElementById("genderSelect").selectedIndex;
        console.log(genderValue);
        
        const nationalityValue = document.getElementById("nationalitySelect").selectedIndex + 3;
        console.log(nationalityValue);
        this.setState( {
            genderSelected: document.getElementsByTagName("option")[genderValue].value,
            nationalitySelected: document.getElementsByTagName("option")[nationalityValue].value
        } );
    
        /*
        // handle both of the <select> UI elements
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
          [name]: value
        });*/
    }

    /* document.getElementsByTagName("option")[document.getElementById("genderSelect").selectedIndex].value */
    
    render() {
        
        let filteredData;
        if (this.state.genderSelected !== "") {
            filteredData = this.state.users.filter( (item) => {
                return item.gender === this.state.genderSelected;
            });
        }
        else if (this.state.nationalitySelected !== "") {
            filteredData = this.state.users.filter( (item) => {
                return item.nat === this.state.nationalitySelected;
            });
        }
        else {
            filteredData = this.state.users;    
        }
        
        console.log(filteredData);
        
        const list = filteredData.map ( (user, count) => {
            return <User key={user.login.md5} name={`${user.name.first} ${user.name.last}`} email={user.email} nat={user.nat} picture={user.picture} />;
        });
        return (
            <div>
                <h1>50 Random Users:</h1>
                <div>
                    <label>Filter By Gender</label>
                    <select id="genderSelect" name="genderSelect" onChange={this.handleChange}>
                        <option value="">all</option>
                        <option value="male">male</option>
                        <option value="female">female</option>
                    </select>
                </div>
                <div>
                    <label>Filter By Nationality</label>
                    <select id="nationalitySelect" name="nationalitySelect" onChange={this.handleChange}>
                        <option value="">all</option>
                        <option value="AU">AU</option>
                        <option value="BR">BR</option>
                        <option value="CA">CA</option>
                        <option value="CH">CH</option>
                        <option value="DE">DE</option>
                        <option value="DK">DK</option>
                        <option value="ES">ES</option>
                        <option value="FI">FI</option>
                        <option value="FR">FR</option>
                        <option value="GB">GB</option>
                        <option value="IE">IE</option>
                        <option value="IR">IR</option>
                        <option value="NL">NL</option>
                        <option value="NZ">NZ</option>
                        <option value="TR">TR</option>
                        <option value="US">US</option>
                    </select>
                </div>
                {list}
            </div>
        );

        /*
        //optional sorting of users
        const data = this.state.sort === 'no' ? this.state.users : [].concat(this.state.users)
            .sort((a, b) => {
                if(a.name < b.name) return -1;
                if(a.name > b.name) return 1;
                return 0;
        });
        
        // Generate unique user cards for each user
        // Each card needs a unique key, for our purposes we're using
        // name + image URL (not guaranteed to be unique, but sufficient for this)
        // Check the state of the inputs and skip cards not matching the
        // required nationality & gender & search text
        let userList = data.map(user => {
            const genderMatch = (this.state.genderSelected === user.gender || this.state.genderSelected === 'all');
            const natMatch = (this.state.nationalitySelected === user.nationality || this.state.nationalitySelected === 'all');
            const nameMatch = user.name.startsWith(this.state.searchText);
            return (genderMatch && natMatch && nameMatch) ? (
                <UserCard name={user.name} image={user.image} nat={user.nationality} key={user.name + user.image}/>
            ) : null;
        });
        
        
        return (
            <section className="section">
                <div className={this.state.contrastMode ? "notification is-success" : "notification"}>
                    <DropDown options={['all','male','female']} name="genderSelected" handleChange={this.handleChange} label="Filter by gender" selected={this.state.genderSelected} />

                    <DropDown options={['all'].concat(this.state.nationalityValues)} name="nationalitySelected" handleChange={this.handleChange} label="Filter by nationality" selected={this.state.nationalitySelected} />

                    <SortRadioButton handleChange={this.handleChange} checked={this.state.sort}/>

                    <LabelledInput name="searchText" label="Search by name" value={this.state.searchText} handleChange={this.handleChange} placeholder={"e.g. alberto"} />

                    <ToggleButton name="contrastMode" handleClick={this.handleClick} toggle={this.state.contrastMode} labelOn="Switch to low contrast" labelOff="Switch to high contrast" />

                    <div className="columns is-multiline">
                        {userList}
                    </div>
                </div>

            </section>
        );
        */
    }
    
}

class User extends React.Component {
    render() {
        return (
            <div style={{'borderStyle': 'dotted', 'padding': '10px 0px 10px 0px', 'text-align': 'center'}}>
                <h3>{this.props.name}</h3>
                <p>{this.props.nat}</p>
                <img src={this.props.picture.large} alt="Profile Pic"></img>
            </div>
        );
    }
}

export default FetchActivity;
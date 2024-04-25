import React, { useState, useContext } from 'react';
import Layout from './Layout';
import { UserContext } from '../contexts/UserContext'; // Import UserContext
import 'bulma/css/bulma.css';

type Group = {
    group_id: number;
    name: string;
    questions: never[];
    creator: string;
};

const groupsData = [
    { group_id: 1, name: 'Group 1', questions: [], creator: 'oo ' },
    { group_id: 2, name: 'Group 2', questions: [], creator: 'oo ' },
    { id: 3, name: 'Group 3', questions: [], creator: 'TESTER ' },
];

function GroupPage({ isAuthenticated, handleLogin, handleLogout, handleNavigate }) {
    const [groupCode, setGroupCode] = useState('');
    const [groups, setGroups] = useState(groupsData);
    const [search, setSearch] = useState('');

    // Use the useContext hook to access the currentUser from UserContext
    const { currentUser } = useContext(UserContext);
    console.log("Current User ID:", currentUser?.userId); // Check if currentUser is defined


    const handleCreateGroup = async () => {
        const name = prompt('Enter group name');
        if (!name) return;

        // Retrieve user data from localStorage
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const userId = userData.userId;  // Assuming the login response stores userData with userId

        try {
            const response = await fetch('http://localhost:3001/api/groups/createGroup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, userId }),  // Include userId when creating the group
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(`Failed to create group: ${responseData.error || 'Unknown error'}`);
            }

            // Add the new group to the groups state
            setGroups(prevGroups => [...prevGroups, responseData]);
            console.log("Current User ID:", currentUser.id);
            // Make an API call to add the current user to the new group
            const response2 = await fetch('http://localhost:3001/api/groups/addMember', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ group_id: responseData.group_id, user_id: currentUser.id }),
            });

            if (!response2.ok) {
                throw new Error('Failed to add user to group');
            }

        } catch (error) {
            console.error('Failed to create group:', error);
        }
    };


    const handleJoinGroup = async () => {
        if (!groupCode) {
            alert('Please enter a group code');
            return;
        }

        try {
            const response = await fetch('/api/groups/join', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code: groupCode }),
            });

            if (!response.ok) {
                throw new Error('Failed to join group');
            }

            const joinedGroup = await response.json();
            setGroups([...groups, joinedGroup]);
            setGroupCode('');
        } catch (error) {
            console.error('Failed to join group:', error);
        }
    };

    const handleLeaveGroup = async (group) => {
        try {
            // Make a DELETE request to the /leave/:groupId route
            const response = await fetch(`http://localhost:3001/api/users/leavegroup/${group.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    // Include your authentication token here
                },
            });

            if (!response.ok) {
                throw new Error('Failed to leave group');
            }

            // After the API call is successful, remove the group from the groups state
            setGroups(groups.filter(g => g.id !== group.id));
        } catch (error) {
            console.error('Failed to leave group:', error);
        }
    };

    const handleAdminControls = (group) => {
        // Open a popup with the admin controls
        console.log('Admin controls for group:', group.name);
    };

    const handleShowQuestions = (group) => {
        console.log('Show questions for group:', group.name);
        // Logic to show questions for the selected group
    };

    const handleGoToEditor = (group) => {
        console.log('Go to editor for group:', group.name);
        // Logic to navigate to editor page for the selected group
    };

    const filteredGroups = groups.filter(group =>
        group.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Layout title="My Groups" isAuthenticated={isAuthenticated} handleLogin={handleLogin} handleLogout={handleLogout} handleNavigate={handleNavigate}>
            <div className="container">
                <div className="field has-addons" style={{ marginTop: '20px' }}>
                    <div className="control is-expanded">
                        <input className="input" type="text" placeholder="Search Group" value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                </div>
                <div className="buttons">
                    <button className="button is-primary" onClick={handleCreateGroup}>Create Group</button>
                </div>
                <div className="columns is-multiline">
                    {filteredGroups.map((group: Group) => (
                        <div key={group.group_id} className="column is-one-third">
                            <div className="box">
                                <h2 className="title is-4" dangerouslySetInnerHTML={{
                                    __html: search.length >= 3 ?
                                        group.name.replace(new RegExp(`(${search})`, 'gi'), '<mark>$1</mark>')
                                        :
                                        group.name
                                }} />
                                <div className="buttons are-small">
                                    <button className="button is-info" onClick={() => handleShowQuestions(group)}>
                                        Show Questions
                                    </button>
                                    <button className="button is-success" onClick={() => handleGoToEditor(group)}>
                                        GO
                                    </button>
                                    <button className="button is-warning" onClick={() => handleLeaveGroup(group)}>
                                        Leave Group
                                    </button>
                                    {group.creator === currentUser && (
                                        <button className="button is-danger" onClick={() => handleAdminControls(group)}>
                                            Admin Controls
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}

export default GroupPage;
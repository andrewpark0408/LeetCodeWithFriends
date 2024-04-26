import { useEffect, useState } from 'react';
import Layout from './Layout';
import { useUser } from '../contexts/UserContext'; // Import UserContext and UserContextType
import 'bulma/css/bulma.css';

type Group = {
    group_id: number;
    name: string;
    questions: never[];
    creator: string;
    id: number;
};

type GroupPageProps = {
    isAuthenticated: boolean;
    handleLogin: () => void;
    handleLogout: () => void;
    handleNavigate: () => void;
};

const groupsData: Group[] = [];

function GroupPage({ isAuthenticated, handleLogin, handleLogout, handleNavigate }: GroupPageProps) {
    const [groups, setGroups] = useState<Group[]>(groupsData); // Specify the type of groups
    const [search, setSearch] = useState('');

    // Use the useContext hook to access the currentUser from UserContext
    const { user } = useUser(); // Specify the type of user
    console.log("Current User:", user)
    console.log("Current User ID:", user?.userId); // Check if user is defined

     // Fetch the user's groups when the page loads
     useEffect(() => {
        const fetchGroups = async () => {
            if (!user) return;
            try {
                console.log("Current User ID:", user.userId)
                const response = await fetch(`http://localhost:3001/api/users/userGroups/${user.userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
            });

                if (!response.ok) {
                    throw new Error('Failed to fetch groups');
                }

                const fetchedGroups = await response.json();
                setGroups(fetchedGroups);
            } catch (error) {
                console.error('Failed to fetch groups:', error);
            }
        };

        fetchGroups();
    }, [user]);

    const handleCreateGroup = async () => {
        const name = prompt('Enter group name');
        if (!name) return;

        // Retrieve user data from localStorage
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
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
            setGroups(prevGroups => [...prevGroups, { ...responseData, id: responseData.group_id, creator: userId.toString() }]);

            if (user) {
                console.log("Current User ID:", user.userId);
            }

        } catch (error) {
            console.error('Failed to create group:', error);
        }
    };


    // const handleJoinGroup = async () => {
        // if (!groupCode) {
        //     alert('Please enter a group code');
        //     return;
        // }

        // try {
        //     const response = await fetch('/api/groups/join', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({ code: groupCode }),
        //     });

        //     if (!response.ok) {
        //         throw new Error('Failed to join group');
        //     }

        //     const joinedGroup = await response.json();
        //     setGroups([...groups, joinedGroup]);
        //     setGroupCode('');
        // } catch (error) {
        //     console.error('Failed to join group:', error);
        // }
    // };

    const handleLeaveGroup = async (group: Group) => {
        try {
            // Make a DELETE request to the /leave/:groupId route
            const response = await fetch(`http://localhost:3001/api/groups/leavegroup/${group.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                credentials: 'include',
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

    const handleAdminControls = (group: Group) => {
        // Open a popup with the admin controls
        console.log('Admin controls for group:', group.name);
    };

    const handleShowQuestions = (group: Group) => {
        console.log('Show questions for group:', group.name);
        // Logic to show questions for the selected group
    };

    const handleGoToEditor = (group: Group) => {
        console.log('Go to editor for group:', group.name);
        // Logic to navigate to editor page for the selected group
    };

    const filteredGroups = groups.filter(group =>
        group.name.toLowerCase().includes(search.toLowerCase())
    );


    return (
        <Layout
        title="Home"
        isAuthenticated={isAuthenticated}
        handleLogin={handleLogin}
        handleLogout={handleLogout}
        handleNavigate={handleNavigate}
        >
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
                                    {user && group.creator === user.userId.toString() && (
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
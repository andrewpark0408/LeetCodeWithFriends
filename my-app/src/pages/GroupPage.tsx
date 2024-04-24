import React, { useState } from 'react';

const groupsData = [
    { id: 1, name: 'Group 1', questions: [], releaseDate: new Date('2024-04-23') },
    { id: 2, name: 'Group 2', questions: [], releaseDate: new Date('2024-04-24') },
    { id: 3, name: 'Group 3', questions: [], releaseDate: new Date('2024-04-25') },
];

function GroupPage() {
    const [groupCode, setGroupCode] = useState('');
    const [groups, setGroups] = useState(groupsData);

    const handleCreateGroup = async () => {
        // API call to create group
        console.log('Creating group');
    };

    const handleJoinGroup = async () => {
        // API call to join group
        console.log('Joining group with code:', groupCode);
    };

    const handleShowQuestions = (group) => {
        console.log('Show questions for group:', group.name);
        // Logic to show questions for the selected group
    };

    const handleGoToEditor = (group) => {
        console.log('Go to editor for group:', group.name);
        // Logic to navigate to editor page for the selected group
    };

    const formatDate = (date) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(date).toLocaleDateString('en-US', options);
    };

    return (
        <div className="container">
            <div className="buttons">
                <button className="button is-primary" onClick={handleCreateGroup}>Create Group</button>
            </div>
            <div className="groups-container">
                {groups.map((group) => (
                    <div key={group.id} className="group-box">
                        <h2>{group.name}</h2>
                        <div className="group-info">
                            <span className="release-date">Release Date: {formatDate(group.releaseDate)}</span>
                            <button className="button is-info" onClick={() => handleShowQuestions(group)}>
                                Show Questions
                            </button>
                            {group.releaseDate <= new Date() ? (
                                <button className="button is-success" onClick={() => handleGoToEditor(group)}>
                                    GO
                                </button>
                            ) : (
                                <button className="button is-success" disabled>
                                    GO
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <div className="field has-addons">
                <div className="control is-expanded">
                    <input className="input" type="text" placeholder="Group Code" value={groupCode} onChange={(e) => setGroupCode(e.target.value)} />
                </div>
                <div className="control">
                    <button className="button is-info" onClick={handleJoinGroup}>Join Group</button>
                </div>
            </div>
        </div>
    );
}

export default GroupPage;

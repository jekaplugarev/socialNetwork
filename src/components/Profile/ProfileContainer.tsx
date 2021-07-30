import React from 'react';
import {Profile} from './Profile';
import {connect} from 'react-redux';
import {AppStateType} from '../../redux/redux-store';
import {getStatus, getUserProfile, ProfilePageType, updateStatus} from '../../redux/profile-reducer';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import {withAuthRedirect} from '../../hoc/withAuthRedirect';
import {compose} from 'redux';

type MapStateToPropsType = {
    profile: ProfilePageType
    authorizedUserId: number | null
}
type MapDispatchToPropsType = {
    getUserProfile: (userId: number) => void
    getStatus: (userId: number) => void
    updateStatus: (status: string) => void
}

export type ProfileContainerPropsType = MapStateToPropsType & MapDispatchToPropsType

type PathParamsType = {
    userId: string
}
type PropsType = RouteComponentProps<PathParamsType> & ProfileContainerPropsType

class ProfileContainer extends React.Component <PropsType> {
    componentDidMount() {
        let userId = this.props.match.params.userId
        !userId && (userId = String(this.props.authorizedUserId)) //17666

        this.props.getUserProfile(+userId)
        this.props.getStatus(+userId)
    }

    render() {
        return <Profile
            {...this.props}
            profile={this.props.profile.profile}
            status={this.props.profile.status}
            updateStatus={this.props.updateStatus}
        />
    }
}


const mapStateToProps = (state: AppStateType): MapStateToPropsType => ({
    profile: state.profilePage,
    authorizedUserId: state.auth.id
})

export default compose<React.ComponentType>(
    connect(mapStateToProps, {getUserProfile, getStatus, updateStatus}),
    withRouter,
    withAuthRedirect
)(ProfileContainer)
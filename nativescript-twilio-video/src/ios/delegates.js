"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var observable_1 = require("tns-core-modules/data/observable");
var DelegateEvents = (function () {
    function DelegateEvents() {
    }
    return DelegateEvents;
}());
DelegateEvents._event = new observable_1.Observable();
exports.DelegateEvents = DelegateEvents;
var RoomDelegate = (function (_super) {
    __extends(RoomDelegate, _super);
    function RoomDelegate() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RoomDelegate.initWithOwner = function (owner, ctx) {
        var roomDelegate = new RoomDelegate();
        roomDelegate._event = DelegateEvents._event;
        roomDelegate._owner = owner;
        roomDelegate.context = ctx;
        return roomDelegate;
    };
    RoomDelegate.prototype.didConnectToRoom = function (room) {
        this.context.connectToRoomWithListener(room);
        this._event.notify({
            eventName: 'didConnectToRoom',
            object: observable_1.fromObject({
                room: room,
                count: room.remoteParticipants.count
            })
        });
        console.log('didConnectToRoom');
    };
    RoomDelegate.prototype.roomParticipantDidConnect = function (room, participant) {
        console.log('roomParticipantDidConnect');
        this.context.participant_joined_room(participant);
        this._event.notify({
            eventName: 'participantDidConnect',
            object: observable_1.fromObject({
                room: room,
                participant: participant,
                count: room.remoteParticipants.count
            })
        });
        console.log('participantDidConnect');
    };
    RoomDelegate.prototype.roomParticipantDidDisconnect = function (room, participant) {
        if (this.context.remoteParticipants === participant) {
            console.log('roomParticipantDidDisconnect');
            this.context.cleanupRemoteParticipant();
        }
        this._event.notify({
            eventName: 'participantDidDisconnect',
            object: observable_1.fromObject({
                room: room,
                participant: participant
            })
        });
        console.log('participantDidDisconnect');
    };
    RoomDelegate.prototype.roomDidFailToConnectWithError = function (room, error) {
        this._event.notify({
            eventName: 'didFailToConnectWithError',
            object: observable_1.fromObject({
                room: room,
                error: error
            })
        });
        console.log('didFailToConnectWithError');
    };
    ;
    RoomDelegate.prototype.roomDidDisconnectWithError = function (room, error) {
        this.context.cleanupRemoteParticipant();
        this._event.notify({
            eventName: 'disconnectedWithError',
            object: observable_1.fromObject({
                room: room,
                error: error
            })
        });
        console.log('disconnectedWithError');
    };
    ;
    RoomDelegate.prototype.roomDidStartRecording = function (room) {
        console.log('roomDidStartRecording');
    };
    RoomDelegate.prototype.roomDidStopRecording = function (room) {
        console.log('roomDidStopRecording');
    };
    Object.defineProperty(RoomDelegate.prototype, "events", {
        get: function () {
            return this._event;
        },
        enumerable: true,
        configurable: true
    });
    return RoomDelegate;
}(NSObject));
RoomDelegate.ObjCProtocols = [TVIRoomDelegate];
exports.RoomDelegate = RoomDelegate;
var RemoteParticipantDelegate = (function (_super) {
    __extends(RemoteParticipantDelegate, _super);
    function RemoteParticipantDelegate() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RemoteParticipantDelegate.initWithOwner = function (owner, ctx) {
        var remoteParticipantDelegate = new RemoteParticipantDelegate();
        remoteParticipantDelegate._event = DelegateEvents._event;
        remoteParticipantDelegate._owner = owner;
        remoteParticipantDelegate.context = ctx;
        return remoteParticipantDelegate;
    };
    RemoteParticipantDelegate.prototype.remoteParticipantPublishedVideoTrack = function (participant, publication) {
        this._event.notify({
            eventName: 'participantPublishedVideoTrack',
            object: observable_1.fromObject({
                participant: participant,
                publication: publication,
            })
        });
    };
    RemoteParticipantDelegate.prototype.remoteParticipantUnpublishedVideoTrack = function (participant, publication) {
        this._event.notify({
            eventName: 'participantUnpublishedVideoTrack',
            object: observable_1.fromObject({
                participant: participant,
                publication: publication,
            })
        });
    };
    RemoteParticipantDelegate.prototype.remoteParticipantPublishedAudioTrack = function (participant, publication) {
        this._event.notify({
            eventName: 'participantPublishedAudioTrack',
            object: observable_1.fromObject({
                participant: participant,
                publication: publication,
            })
        });
    };
    RemoteParticipantDelegate.prototype.remoteParticipantUnpublishedAudioTrack = function (participant, publication) {
        this._event.notify({
            eventName: 'participantUnpublishedAudioTrack',
            object: observable_1.fromObject({
                participant: participant,
                publication: publication,
            })
        });
    };
    RemoteParticipantDelegate.prototype.subscribedToVideoTrackPublicationForParticipant = function (videoTrack, publication, participant) {
        videoTrack.addRenderer(this.context.remoteVideoView);
        this.context.videoTrack = videoTrack;
        this._event.notify({
            eventName: 'onVideoTrackSubscribed',
            object: observable_1.fromObject({
                videoTrack: videoTrack,
                publication: publication,
                participant: participant
            })
        });
    };
    RemoteParticipantDelegate.prototype.unsubscribedFromVideoTrackPublicationForParticipant = function (videoTrack, publication, participant) {
        videoTrack.removeRenderer(this.context.remoteVideoView);
        this.context.remoteVideoView.removeFromSuperview();
        this._event.notify({
            eventName: 'onVideoTrackUnsubscribed',
            object: observable_1.fromObject({
                videoTrack: videoTrack,
                publication: publication,
                participant: participant
            })
        });
    };
    RemoteParticipantDelegate.prototype.subscribedToAudioTrackPublicationForParticipant = function (audioTrack, publication, participant) {
        this._event.notify({
            eventName: 'onAudioTrackSubscribed',
            object: observable_1.fromObject({
                audioTrack: audioTrack,
                publication: publication,
                participant: participant
            })
        });
    };
    RemoteParticipantDelegate.prototype.unsubscribedFromAudioTrackPublicationForParticipant = function (videoTrack, publication, participant) {
        this._event.notify({
            eventName: 'onAudioTrackUnsubscribed',
            object: observable_1.fromObject({
                videoTrack: videoTrack,
                publication: publication,
                participant: participant
            })
        });
    };
    RemoteParticipantDelegate.prototype.remoteParticipantEnabledVideoTrack = function (participant, publication) {
        this._event.notify({
            eventName: 'participantEnabledVideoTrack',
            object: observable_1.fromObject({
                publication: publication,
                participant: participant
            })
        });
    };
    RemoteParticipantDelegate.prototype.remoteParticipantDisabledVideoTrack = function (participant, publication) {
        this._event.notify({
            eventName: 'participantDisabledVideoTrack',
            object: observable_1.fromObject({
                publication: publication,
                participant: participant
            })
        });
    };
    RemoteParticipantDelegate.prototype.remoteParticipantEnabledAudioTrack = function (participant, publication) {
        this._event.notify({
            eventName: 'participantEnabledAudioTrack',
            object: observable_1.fromObject({
                publication: publication,
                participant: participant
            })
        });
    };
    RemoteParticipantDelegate.prototype.remoteParticipantDisabledAudioTrack = function (participant, publication) {
        this._event.notify({
            eventName: 'participantDisabledAudioTrack',
            object: observable_1.fromObject({
                publication: publication,
                participant: participant
            })
        });
    };
    Object.defineProperty(RemoteParticipantDelegate.prototype, "events", {
        get: function () {
            return this._event;
        },
        enumerable: true,
        configurable: true
    });
    return RemoteParticipantDelegate;
}(NSObject));
RemoteParticipantDelegate.ObjCProtocols = [TVIRemoteParticipantDelegate];
exports.RemoteParticipantDelegate = RemoteParticipantDelegate;
var VideoViewDelegate = (function (_super) {
    __extends(VideoViewDelegate, _super);
    function VideoViewDelegate() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    VideoViewDelegate.initWithOwner = function (owner) {
        var videoViewDelegate = new VideoViewDelegate();
        videoViewDelegate._event = DelegateEvents._event;
        videoViewDelegate._owner = owner;
        return videoViewDelegate;
    };
    VideoViewDelegate.prototype.videoViewDidReceiveData = function (view) {
        console.log('videoViewDidReceiveData');
        this._event.notify({
            eventName: 'videoViewDidReceiveData',
            object: observable_1.fromObject({
                view: view,
            })
        });
    };
    Object.defineProperty(VideoViewDelegate.prototype, "events", {
        get: function () {
            return this._event;
        },
        enumerable: true,
        configurable: true
    });
    return VideoViewDelegate;
}(NSObject));
VideoViewDelegate.ObjCProtocols = [TVIVideoViewDelegate];
exports.VideoViewDelegate = VideoViewDelegate;
var CameraCapturerDelegate = (function (_super) {
    __extends(CameraCapturerDelegate, _super);
    function CameraCapturerDelegate() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CameraCapturerDelegate.initWithOwner = function (owner) {
        var cameraCapturerDelegate = new CameraCapturerDelegate();
        cameraCapturerDelegate._event = DelegateEvents._event;
        cameraCapturerDelegate._owner = owner;
        return cameraCapturerDelegate;
    };
    CameraCapturerDelegate.prototype.cameraCapturerDidStartWithSource = function (capturer, source) {
        console.log('cameraCapturer didStartWithSource');
        this._event.notify({
            eventName: 'cameraCapturer',
            object: observable_1.fromObject({
                capturer: capturer,
                source: source
            })
        });
    };
    CameraCapturerDelegate.prototype.cameraCapturerWasInterrupted = function (capturer, reason) {
        console.log('cameraCapturerWasInterrupted');
        this._event.notify({
            eventName: 'cameraCapturerWasInterrupted',
            object: observable_1.fromObject({
                capturer: capturer,
                reason: reason,
            })
        });
    };
    CameraCapturerDelegate.prototype.cameraCapturerDidFailWithError = function (capturer, error) {
        console.log('cameraCapturerDidFailWithError');
        this._event.notify({
            eventName: 'cameraCapturerDidFailWithError',
            object: observable_1.fromObject({
                capturer: capturer,
                error: error,
            })
        });
    };
    Object.defineProperty(CameraCapturerDelegate.prototype, "events", {
        get: function () {
            return this._event;
        },
        enumerable: true,
        configurable: true
    });
    return CameraCapturerDelegate;
}(NSObject));
CameraCapturerDelegate.ObjCProtocols = [TVICameraCapturerDelegate];
exports.CameraCapturerDelegate = CameraCapturerDelegate;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVsZWdhdGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGVsZWdhdGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0RBQTBFO0FBTTFFO0lBQUE7SUFJQSxDQUFDO0lBQUQscUJBQUM7QUFBRCxDQUFDLEFBSkQ7QUFFVyxxQkFBTSxHQUFlLElBQUksdUJBQVUsRUFBRSxDQUFDO0FBRnBDLHdDQUFjO0FBTTNCO0lBQWtDLGdDQUFRO0lBQTFDOztJQStIQSxDQUFDO0lBbkhpQiwwQkFBYSxHQUEzQixVQUE0QixLQUFtQixFQUFFLEdBQUc7UUFFaEQsSUFBSSxZQUFZLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUV0QyxZQUFZLENBQUMsTUFBTSxHQUFHLGNBQWMsQ0FBQyxNQUFNLENBQUE7UUFFM0MsWUFBWSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7UUFFNUIsWUFBWSxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUM7UUFFM0IsTUFBTSxDQUFDLFlBQVksQ0FBQztJQUV4QixDQUFDO0lBRU0sdUNBQWdCLEdBQXZCLFVBQXdCLElBQUk7UUFFeEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUU3QyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztZQUNmLFNBQVMsRUFBRSxrQkFBa0I7WUFDN0IsTUFBTSxFQUFFLHVCQUFVLENBQUM7Z0JBQ2YsSUFBSSxFQUFFLElBQUk7Z0JBQ1YsS0FBSyxFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLO2FBQ3ZDLENBQUM7U0FDTCxDQUFDLENBQUE7UUFDRixPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUVNLGdEQUF5QixHQUFoQyxVQUFpQyxJQUFJLEVBQUUsV0FBVztRQUM5QyxPQUFPLENBQUMsR0FBRyxDQUFDLDJCQUEyQixDQUFDLENBQUM7UUFLekMsSUFBSSxDQUFDLE9BQU8sQ0FB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LE1BQU0sRUFBRSx1QkFBVSxDQUFDO2dCQUNmLFFBQVEsRUFBRSxRQUFRO2dCQUNsQixLQUFLLEVBQUUsS0FBSzthQUNmLENBQUM7U0FDTCxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsc0JBQUksMENBQU07YUFBVjtZQUVJLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBRXZCLENBQUM7OztPQUFBO0lBRUwsNkJBQUM7QUFBRCxDQUFDLEFBdkVELENBQTRDLFFBQVE7QUFFbEMsb0NBQWEsR0FBRyxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFGakQsd0RBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT2JzZXJ2YWJsZSwgZnJvbU9iamVjdCB9IGZyb20gJ3Rucy1jb3JlLW1vZHVsZXMvZGF0YS9vYnNlcnZhYmxlJztcblxuZGVjbGFyZSB2YXIgVFZJVmlkZW9WaWV3RGVsZWdhdGUsIFRWSUNhbWVyYUNhcHR1cmVyRGVsZWdhdGUsIFRWSVJlbW90ZVBhcnRpY2lwYW50RGVsZWdhdGUsIE5TT2JqZWN0LCBUVklSb29tRGVsZWdhdGU7XG4vLyBUVklSZW1vdGVQYXJ0aWNpcGFudERlbGVnYXRlXG4vLyBUVklQYXJ0aWNpcGFudERlbGVnYXRlXG5cbmV4cG9ydCBjbGFzcyBEZWxlZ2F0ZUV2ZW50cyB7XG5cbiAgICBzdGF0aWMgX2V2ZW50OiBPYnNlcnZhYmxlID0gbmV3IE9ic2VydmFibGUoKTtcblxufVxuXG5leHBvcnQgY2xhc3MgUm9vbURlbGVnYXRlIGV4dGVuZHMgTlNPYmplY3Qge1xuXG4gICAgc3RhdGljIE9iakNQcm90b2NvbHMgPSBbVFZJUm9vbURlbGVnYXRlXTsgLy8gZGVmaW5lIG91ciBuYXRpdmUgcHJvdG9jYWxsc1xuXG4gICAgcHJpdmF0ZSBfZXZlbnQ6IE9ic2VydmFibGU7XG5cbiAgICBwcml2YXRlIF9vd25lcjogV2Vha1JlZjxhbnk+O1xuXG4gICAgcHVibGljIF9wYXJ0aWNpcGFudERlbGVnYXRlOiBSb29tRGVsZWdhdGU7XG5cbiAgICBjb250ZXh0OiBhbnk7XG5cbiAgICBwdWJsaWMgc3RhdGljIGluaXRXaXRoT3duZXIob3duZXI6IFdlYWtSZWY8YW55PiwgY3R4KTogUm9vbURlbGVnYXRlIHtcblxuICAgICAgICBsZXQgcm9vbURlbGVnYXRlID0gbmV3IFJvb21EZWxlZ2F0ZSgpO1xuXG4gICAgICAgIHJvb21EZWxlZ2F0ZS5fZXZlbnQgPSBEZWxlZ2F0ZUV2ZW50cy5fZXZlbnRcblxuICAgICAgICByb29tRGVsZWdhdGUuX293bmVyID0gb3duZXI7XG5cbiAgICAgICAgcm9vbURlbGVnYXRlLmNvbnRleHQgPSBjdHg7XG5cbiAgICAgICAgcmV0dXJuIHJvb21EZWxlZ2F0ZTtcblxuICAgIH1cblxuICAgIHB1YmxpYyBkaWRDb25uZWN0VG9Sb29tKHJvb20pOiB2b2lkIHtcblxuICAgICAgICB0aGlzLmNvbnRleHQuY29ubmVjdFRvUm9vbVdpdGhMaXN0ZW5lcihyb29tKTtcblxuICAgICAgICB0aGlzLl9ldmVudC5ub3RpZnkoe1xuICAgICAgICAgICAgZXZlbnROYW1lOiAnZGlkQ29ubmVjdFRvUm9vbScsXG4gICAgICAgICAgICBvYmplY3Q6IGZyb21PYmplY3Qoe1xuICAgICAgICAgICAgICAgIHJvb206IHJvb20sXG4gICAgICAgICAgICAgICAgY291bnQ6IHJvb20ucmVtb3RlUGFydGljaXBhbnRzLmNvdW50XG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgICBjb25zb2xlLmxvZygnZGlkQ29ubmVjdFRvUm9vbScpO1xuICAgIH1cblxuICAgIHB1YmxpYyByb29tUGFydGljaXBhbnREaWRDb25uZWN0KHJvb20sIHBhcnRpY2lwYW50KTogdm9pZCB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdyb29tUGFydGljaXBhbnREaWRDb25uZWN0Jyk7XG4gICAgICAgIC8vIGlmICghdGhpcy5jb250ZXh0LnJlbW90ZVBhcnRpY2lwYW50IHx8IHRoaXMuY29udGV4dC5yZW1vdGVQYXJ0aWNpcGFudCA9PT0gbnVsbCkge1xuICAgICAgICAvLyAgICAgdGhpcy5jb250ZXh0LnJlbW90ZVBhcnRpY2lwYW50ID0gcGFydGljaXBhbnQ7XG4gICAgICAgIC8vICAgICB0aGlzLmNvbnRleHQucmVtb3RlUGFydGljaXBhbnQuZGVsZWdhdGUgPSB0aGlzO1xuICAgICAgICAvLyB9XG4gICAgICAgIHRoaXMuY29udGV4dC5wYXJ0aWNpcGFudF9qb2luZWRfcm9vbShwYXJ0aWNpcGFudCk7XG5cbiAgICAgICAgdGhpcy5fZXZlbnQubm90aWZ5KHtcbiAgICAgICAgICAgIGV2ZW50TmFtZTogJ3BhcnRpY2lwYW50RGlkQ29ubmVjdCcsXG4gICAgICAgICAgICBvYmplY3Q6IGZyb21PYmplY3Qoe1xuICAgICAgICAgICAgICAgIHJvb206IHJvb20sXG4gICAgICAgICAgICAgICAgcGFydGljaXBhbnQ6IHBhcnRpY2lwYW50LFxuICAgICAgICAgICAgICAgIGNvdW50OiByb29tLnJlbW90ZVBhcnRpY2lwYW50cy5jb3VudFxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcblxuICAgICAgICBjb25zb2xlLmxvZygncGFydGljaXBhbnREaWRDb25uZWN0Jyk7XG5cbiAgICB9XG4gICAgcHVibGljIHJvb21QYXJ0aWNpcGFudERpZERpc2Nvbm5lY3Qocm9vbSwgcGFydGljaXBhbnQpOiB2b2lkIHtcblxuICAgICAgICBpZiAodGhpcy5jb250ZXh0LnJlbW90ZVBhcnRpY2lwYW50cyA9PT0gcGFydGljaXBhbnQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdyb29tUGFydGljaXBhbnREaWREaXNjb25uZWN0Jyk7XG4gICAgICAgICAgICB0aGlzLmNvbnRleHQuY2xlYW51cFJlbW90ZVBhcnRpY2lwYW50KCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9ldmVudC5ub3RpZnkoe1xuICAgICAgICAgICAgZXZlbnROYW1lOiAncGFydGljaXBhbnREaWREaXNjb25uZWN0JyxcbiAgICAgICAgICAgIG9iamVjdDogZnJvbU9iamVjdCh7XG4gICAgICAgICAgICAgICAgcm9vbTogcm9vbSxcbiAgICAgICAgICAgICAgICBwYXJ0aWNpcGFudDogcGFydGljaXBhbnRcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICAgIGNvbnNvbGUubG9nKCdwYXJ0aWNpcGFudERpZERpc2Nvbm5lY3QnKTtcbiAgICB9XG5cblxuXG4gICAgcHVibGljIHJvb21EaWRGYWlsVG9Db25uZWN0V2l0aEVycm9yKHJvb20sIGVycm9yKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX2V2ZW50Lm5vdGlmeSh7XG4gICAgICAgICAgICBldmVudE5hbWU6ICdkaWRGYWlsVG9Db25uZWN0V2l0aEVycm9yJyxcbiAgICAgICAgICAgIG9iamVjdDogZnJvbU9iamVjdCh7XG4gICAgICAgICAgICAgICAgcm9vbTogcm9vbSxcbiAgICAgICAgICAgICAgICBlcnJvcjogZXJyb3JcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICAgIGNvbnNvbGUubG9nKCdkaWRGYWlsVG9Db25uZWN0V2l0aEVycm9yJyk7XG4gICAgfTtcblxuICAgIHB1YmxpYyByb29tRGlkRGlzY29ubmVjdFdpdGhFcnJvcihyb29tLCBlcnJvcik6IHZvaWQge1xuICAgICAgICB0aGlzLmNvbnRleHQuY2xlYW51cFJlbW90ZVBhcnRpY2lwYW50KCk7XG4gICAgICAgIHRoaXMuX2V2ZW50Lm5vdGlmeSh7XG4gICAgICAgICAgICBldmVudE5hbWU6ICdkaXNjb25uZWN0ZWRXaXRoRXJyb3InLFxuICAgICAgICAgICAgb2JqZWN0OiBmcm9tT2JqZWN0KHtcbiAgICAgICAgICAgICAgICByb29tOiByb29tLFxuICAgICAgICAgICAgICAgIGVycm9yOiBlcnJvclxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgICAgY29uc29sZS5sb2coJ2Rpc2Nvbm5lY3RlZFdpdGhFcnJvcicpXG4gICAgfTtcblxuICAgIHJvb21EaWRTdGFydFJlY29yZGluZyhyb29tKTogdm9pZCB7XG4gICAgICAgIC8vICAgICB0aGlzLl9ldmVudC5ub3RpZnkoe1xuICAgICAgICAvLyAgICAgICAgIGV2ZW50TmFtZTogJ3Jvb21EaWRTdGFydFJlY29yZGluZycsXG4gICAgICAgIC8vICAgICAgICAgb2JqZWN0OiBmcm9tT2JqZWN0KHtcbiAgICAgICAgLy8gICAgICAgICAgICAgcm9vbTogcm9vbSxcbiAgICAgICAgLy8gICAgICAgICB9KVxuICAgICAgICAvLyAgICAgfSlcbiAgICAgICAgY29uc29sZS5sb2coJ3Jvb21EaWRTdGFydFJlY29yZGluZycpXG4gICAgfVxuICAgIHJvb21EaWRTdG9wUmVjb3JkaW5nKHJvb20pOiB2b2lkIHtcbiAgICAgICAgLy8gICAgIHRoaXMuX2V2ZW50Lm5vdGlmeSh7XG4gICAgICAgIC8vICAgICAgICAgZXZlbnROYW1lOiAncm9vbURpZFN0b3BSZWNvcmRpbmcnLFxuICAgICAgICAvLyAgICAgICAgIG9iamVjdDogZnJvbU9iamVjdCh7XG4gICAgICAgIC8vICAgICAgICAgICAgIHJvb206IHJvb20sXG4gICAgICAgIC8vICAgICAgICAgfSlcbiAgICAgICAgLy8gICAgIH0pXG4gICAgICAgIGNvbnNvbGUubG9nKCdyb29tRGlkU3RvcFJlY29yZGluZycpXG4gICAgfVxuXG4gICAgZ2V0IGV2ZW50cygpOiBPYnNlcnZhYmxlIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5fZXZlbnQ7XG5cbiAgICB9XG5cbn1cblxuXG5leHBvcnQgY2xhc3MgUmVtb3RlUGFydGljaXBhbnREZWxlZ2F0ZSBleHRlbmRzIE5TT2JqZWN0IHtcblxuICAgIHN0YXRpYyBPYmpDUHJvdG9jb2xzID0gW1RWSVJlbW90ZVBhcnRpY2lwYW50RGVsZWdhdGVdOyAvLyBkZWZpbmUgb3VyIG5hdGl2ZSBwcm90b2NhbGxzXG5cbiAgICBwcml2YXRlIF9ldmVudDogT2JzZXJ2YWJsZTtcbiAgICBwcml2YXRlIF9vd25lcjogV2Vha1JlZjxhbnk+O1xuICAgIGNvbnRleHQ6IGFueTtcblxuICAgIHB1YmxpYyBzdGF0aWMgaW5pdFdpdGhPd25lcihvd25lcjogV2Vha1JlZjxhbnk+LCBjdHgpOiBSZW1vdGVQYXJ0aWNpcGFudERlbGVnYXRlIHtcblxuICAgICAgICBsZXQgcmVtb3RlUGFydGljaXBhbnREZWxlZ2F0ZSA9IG5ldyBSZW1vdGVQYXJ0aWNpcGFudERlbGVnYXRlKCk7XG5cbiAgICAgICAgcmVtb3RlUGFydGljaXBhbnREZWxlZ2F0ZS5fZXZlbnQgPSBEZWxlZ2F0ZUV2ZW50cy5fZXZlbnRcblxuICAgICAgICByZW1vdGVQYXJ0aWNpcGFudERlbGVnYXRlLl9vd25lciA9IG93bmVyO1xuXG4gICAgICAgIHJlbW90ZVBhcnRpY2lwYW50RGVsZWdhdGUuY29udGV4dCA9IGN0eDtcblxuICAgICAgICByZXR1cm4gcmVtb3RlUGFydGljaXBhbnREZWxlZ2F0ZTtcblxuICAgIH1cblxuXG4gICAgcHVibGljIHJlbW90ZVBhcnRpY2lwYW50UHVibGlzaGVkVmlkZW9UcmFjayhwYXJ0aWNpcGFudCwgcHVibGljYXRpb24pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fZXZlbnQubm90aWZ5KHtcbiAgICAgICAgICAgIGV2ZW50TmFtZTogJ3BhcnRpY2lwYW50UHVibGlzaGVkVmlkZW9UcmFjaycsXG4gICAgICAgICAgICBvYmplY3Q6IGZyb21PYmplY3Qoe1xuICAgICAgICAgICAgICAgIHBhcnRpY2lwYW50OiBwYXJ0aWNpcGFudCxcbiAgICAgICAgICAgICAgICBwdWJsaWNhdGlvbjogcHVibGljYXRpb24sXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIHB1YmxpYyByZW1vdGVQYXJ0aWNpcGFudFVucHVibGlzaGVkVmlkZW9UcmFjayhwYXJ0aWNpcGFudCwgcHVibGljYXRpb24pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fZXZlbnQubm90aWZ5KHtcbiAgICAgICAgICAgIGV2ZW50TmFtZTogJ3BhcnRpY2lwYW50VW5wdWJsaXNoZWRWaWRlb1RyYWNrJyxcbiAgICAgICAgICAgIG9iamVjdDogZnJvbU9iamVjdCh7XG4gICAgICAgICAgICAgICAgcGFydGljaXBhbnQ6IHBhcnRpY2lwYW50LFxuICAgICAgICAgICAgICAgIHB1YmxpY2F0aW9uOiBwdWJsaWNhdGlvbixcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgcHVibGljIHJlbW90ZVBhcnRpY2lwYW50UHVibGlzaGVkQXVkaW9UcmFjayhwYXJ0aWNpcGFudCwgcHVibGljYXRpb24pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fZXZlbnQubm90aWZ5KHtcbiAgICAgICAgICAgIGV2ZW50TmFtZTogJ3BhcnRpY2lwYW50UHVibGlzaGVkQXVkaW9UcmFjaycsXG4gICAgICAgICAgICBvYmplY3Q6IGZyb21PYmplY3Qoe1xuICAgICAgICAgICAgICAgIHBhcnRpY2lwYW50OiBwYXJ0aWNpcGFudCxcbiAgICAgICAgICAgICAgICBwdWJsaWNhdGlvbjogcHVibGljYXRpb24sXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIHB1YmxpYyByZW1vdGVQYXJ0aWNpcGFudFVucHVibGlzaGVkQXVkaW9UcmFjayhwYXJ0aWNpcGFudCwgcHVibGljYXRpb24pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fZXZlbnQubm90aWZ5KHtcbiAgICAgICAgICAgIGV2ZW50TmFtZTogJ3BhcnRpY2lwYW50VW5wdWJsaXNoZWRBdWRpb1RyYWNrJyxcbiAgICAgICAgICAgIG9iamVjdDogZnJvbU9iamVjdCh7XG4gICAgICAgICAgICAgICAgcGFydGljaXBhbnQ6IHBhcnRpY2lwYW50LFxuICAgICAgICAgICAgICAgIHB1YmxpY2F0aW9uOiBwdWJsaWNhdGlvbixcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgcHVibGljIHN1YnNjcmliZWRUb1ZpZGVvVHJhY2tQdWJsaWNhdGlvbkZvclBhcnRpY2lwYW50KHZpZGVvVHJhY2ssIHB1YmxpY2F0aW9uLCBwYXJ0aWNpcGFudCk6IHZvaWQge1xuICAgICAgICAvLyBjb25zb2xlLmRpcih0aGlzLmNvbnRleHQucmVtb3RlVmlkZW9WaWV3KVxuICAgICAgICB2aWRlb1RyYWNrLmFkZFJlbmRlcmVyKHRoaXMuY29udGV4dC5yZW1vdGVWaWRlb1ZpZXcpO1xuICAgICAgICB0aGlzLmNvbnRleHQudmlkZW9UcmFjayA9IHZpZGVvVHJhY2s7XG5cbiAgICAgICAgLy8gdGhpcy5jb250ZXh0LnNldHVwUmVtb3RlVmlldyh2aWRlb1RyYWNrLCBwYXJ0aWNpcGFudCk7XG4gICAgICAgIHRoaXMuX2V2ZW50Lm5vdGlmeSh7XG4gICAgICAgICAgICBldmVudE5hbWU6ICdvblZpZGVvVHJhY2tTdWJzY3JpYmVkJyxcbiAgICAgICAgICAgIG9iamVjdDogZnJvbU9iamVjdCh7XG4gICAgICAgICAgICAgICAgdmlkZW9UcmFjazogdmlkZW9UcmFjayxcbiAgICAgICAgICAgICAgICBwdWJsaWNhdGlvbjogcHVibGljYXRpb24sXG4gICAgICAgICAgICAgICAgcGFydGljaXBhbnQ6IHBhcnRpY2lwYW50XG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgICAvLyBpZiAoc2VsZi5yZW1vdGVQYXJ0aWNpcGFudCA9PSBwYXJ0aWNpcGFudCkge1xuICAgICAgICAvLyAgICAgW3NlbGYgc2V0dXBSZW1vdGVWaWV3XTtcbiAgICAgICAgLy8gICAgIFt2aWRlb1RyYWNrIGFkZFJlbmRlcmVyOnNlbGYucmVtb3RlVmlld107XG4gICAgICAgIC8vIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgdW5zdWJzY3JpYmVkRnJvbVZpZGVvVHJhY2tQdWJsaWNhdGlvbkZvclBhcnRpY2lwYW50KHZpZGVvVHJhY2ssIHB1YmxpY2F0aW9uLCBwYXJ0aWNpcGFudCk6IHZvaWQge1xuXG4gICAgICAgIHZpZGVvVHJhY2sucmVtb3ZlUmVuZGVyZXIodGhpcy5jb250ZXh0LnJlbW90ZVZpZGVvVmlldyk7XG4gICAgICAgIHRoaXMuY29udGV4dC5yZW1vdGVWaWRlb1ZpZXcucmVtb3ZlRnJvbVN1cGVydmlldygpO1xuXG4gICAgICAgIHRoaXMuX2V2ZW50Lm5vdGlmeSh7XG4gICAgICAgICAgICBldmVudE5hbWU6ICdvblZpZGVvVHJhY2tVbnN1YnNjcmliZWQnLFxuICAgICAgICAgICAgb2JqZWN0OiBmcm9tT2JqZWN0KHtcbiAgICAgICAgICAgICAgICB2aWRlb1RyYWNrOiB2aWRlb1RyYWNrLFxuICAgICAgICAgICAgICAgIHB1YmxpY2F0aW9uOiBwdWJsaWNhdGlvbixcbiAgICAgICAgICAgICAgICBwYXJ0aWNpcGFudDogcGFydGljaXBhbnRcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gaWYgKHNlbGYucmVtb3RlUGFydGljaXBhbnQgPT0gcGFydGljaXBhbnQpIHtcbiAgICAgICAgLy8gICAgIFt2aWRlb1RyYWNrIHJlbW92ZVJlbmRlcmVyOnNlbGYucmVtb3RlVmlld107XG4gICAgICAgIC8vICAgICBbc2VsZi5yZW1vdGVWaWV3IHJlbW92ZUZyb21TdXBlcnZpZXddO1xuICAgICAgICAvLyB9XG5cbiAgICB9XG5cbiAgICBwdWJsaWMgc3Vic2NyaWJlZFRvQXVkaW9UcmFja1B1YmxpY2F0aW9uRm9yUGFydGljaXBhbnQoYXVkaW9UcmFjaywgcHVibGljYXRpb24sIHBhcnRpY2lwYW50KTogdm9pZCB7XG4gICAgICAgIHRoaXMuX2V2ZW50Lm5vdGlmeSh7XG4gICAgICAgICAgICBldmVudE5hbWU6ICdvbkF1ZGlvVHJhY2tTdWJzY3JpYmVkJyxcbiAgICAgICAgICAgIG9iamVjdDogZnJvbU9iamVjdCh7XG4gICAgICAgICAgICAgICAgYXVkaW9UcmFjazogYXVkaW9UcmFjayxcbiAgICAgICAgICAgICAgICBwdWJsaWNhdGlvbjogcHVibGljYXRpb24sXG4gICAgICAgICAgICAgICAgcGFydGljaXBhbnQ6IHBhcnRpY2lwYW50XG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIHB1YmxpYyB1bnN1YnNjcmliZWRGcm9tQXVkaW9UcmFja1B1YmxpY2F0aW9uRm9yUGFydGljaXBhbnQodmlkZW9UcmFjaywgcHVibGljYXRpb24sIHBhcnRpY2lwYW50KTogdm9pZCB7XG4gICAgICAgIHRoaXMuX2V2ZW50Lm5vdGlmeSh7XG4gICAgICAgICAgICBldmVudE5hbWU6ICdvbkF1ZGlvVHJhY2tVbnN1YnNjcmliZWQnLFxuICAgICAgICAgICAgb2JqZWN0OiBmcm9tT2JqZWN0KHtcbiAgICAgICAgICAgICAgICB2aWRlb1RyYWNrOiB2aWRlb1RyYWNrLFxuICAgICAgICAgICAgICAgIHB1YmxpY2F0aW9uOiBwdWJsaWNhdGlvbixcbiAgICAgICAgICAgICAgICBwYXJ0aWNpcGFudDogcGFydGljaXBhbnRcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyByZW1vdGVQYXJ0aWNpcGFudEVuYWJsZWRWaWRlb1RyYWNrKHBhcnRpY2lwYW50LCBwdWJsaWNhdGlvbik6IHZvaWQge1xuICAgICAgICB0aGlzLl9ldmVudC5ub3RpZnkoe1xuICAgICAgICAgICAgZXZlbnROYW1lOiAncGFydGljaXBhbnRFbmFibGVkVmlkZW9UcmFjaycsXG4gICAgICAgICAgICBvYmplY3Q6IGZyb21PYmplY3Qoe1xuICAgICAgICAgICAgICAgIHB1YmxpY2F0aW9uOiBwdWJsaWNhdGlvbixcbiAgICAgICAgICAgICAgICBwYXJ0aWNpcGFudDogcGFydGljaXBhbnRcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyByZW1vdGVQYXJ0aWNpcGFudERpc2FibGVkVmlkZW9UcmFjayhwYXJ0aWNpcGFudCwgcHVibGljYXRpb24pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fZXZlbnQubm90aWZ5KHtcbiAgICAgICAgICAgIGV2ZW50TmFtZTogJ3BhcnRpY2lwYW50RGlzYWJsZWRWaWRlb1RyYWNrJyxcbiAgICAgICAgICAgIG9iamVjdDogZnJvbU9iamVjdCh7XG4gICAgICAgICAgICAgICAgcHVibGljYXRpb246IHB1YmxpY2F0aW9uLFxuICAgICAgICAgICAgICAgIHBhcnRpY2lwYW50OiBwYXJ0aWNpcGFudFxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIHJlbW90ZVBhcnRpY2lwYW50RW5hYmxlZEF1ZGlvVHJhY2socGFydGljaXBhbnQsIHB1YmxpY2F0aW9uKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX2V2ZW50Lm5vdGlmeSh7XG4gICAgICAgICAgICBldmVudE5hbWU6ICdwYXJ0aWNpcGFudEVuYWJsZWRBdWRpb1RyYWNrJyxcbiAgICAgICAgICAgIG9iamVjdDogZnJvbU9iamVjdCh7XG4gICAgICAgICAgICAgICAgcHVibGljYXRpb246IHB1YmxpY2F0aW9uLFxuICAgICAgICAgICAgICAgIHBhcnRpY2lwYW50OiBwYXJ0aWNpcGFudFxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIHJlbW90ZVBhcnRpY2lwYW50RGlzYWJsZWRBdWRpb1RyYWNrKHBhcnRpY2lwYW50LCBwdWJsaWNhdGlvbik6IHZvaWQge1xuICAgICAgICB0aGlzLl9ldmVudC5ub3RpZnkoe1xuICAgICAgICAgICAgZXZlbnROYW1lOiAncGFydGljaXBhbnREaXNhYmxlZEF1ZGlvVHJhY2snLFxuICAgICAgICAgICAgb2JqZWN0OiBmcm9tT2JqZWN0KHtcbiAgICAgICAgICAgICAgICBwdWJsaWNhdGlvbjogcHVibGljYXRpb24sXG4gICAgICAgICAgICAgICAgcGFydGljaXBhbnQ6IHBhcnRpY2lwYW50XG4gICAgICAgICAgICB9KVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBnZXQgZXZlbnRzKCk6IE9ic2VydmFibGUge1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9ldmVudDtcblxuICAgIH1cblxufVxuXG5leHBvcnQgY2xhc3MgVmlkZW9WaWV3RGVsZWdhdGUgZXh0ZW5kcyBOU09iamVjdCB7XG5cbiAgICBwdWJsaWMgc3RhdGljIE9iakNQcm90b2NvbHMgPSBbVFZJVmlkZW9WaWV3RGVsZWdhdGVdO1xuXG4gICAgcHJpdmF0ZSBfZXZlbnQ6IE9ic2VydmFibGU7XG5cbiAgICBwcml2YXRlIF9vd25lcjogV2Vha1JlZjxhbnk+O1xuXG4gICAgcHVibGljIHN0YXRpYyBpbml0V2l0aE93bmVyKG93bmVyOiBXZWFrUmVmPGFueT4pOiBWaWRlb1ZpZXdEZWxlZ2F0ZSB7XG5cbiAgICAgICAgbGV0IHZpZGVvVmlld0RlbGVnYXRlID0gbmV3IFZpZGVvVmlld0RlbGVnYXRlKCk7XG5cbiAgICAgICAgdmlkZW9WaWV3RGVsZWdhdGUuX2V2ZW50ID0gRGVsZWdhdGVFdmVudHMuX2V2ZW50XG5cbiAgICAgICAgdmlkZW9WaWV3RGVsZWdhdGUuX293bmVyID0gb3duZXI7XG5cbiAgICAgICAgcmV0dXJuIHZpZGVvVmlld0RlbGVnYXRlO1xuXG4gICAgfVxuXG5cbiAgICBwdWJsaWMgdmlkZW9WaWV3RGlkUmVjZWl2ZURhdGEodmlldzogYW55KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCd2aWRlb1ZpZXdEaWRSZWNlaXZlRGF0YScpO1xuICAgICAgICB0aGlzLl9ldmVudC5ub3RpZnkoe1xuICAgICAgICAgICAgZXZlbnROYW1lOiAndmlkZW9WaWV3RGlkUmVjZWl2ZURhdGEnLFxuICAgICAgICAgICAgb2JqZWN0OiBmcm9tT2JqZWN0KHtcbiAgICAgICAgICAgICAgICB2aWV3OiB2aWV3LFxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gcHVibGljIHZpZGVvVmlld1ZpZGVvRGltZW5zaW9uc0RpZENoYW5nZSh2aWV3OiBhbnksIGRpbWVuc2lvbnM6IGFueSkge1xuICAgIC8vICAgICBjb25zb2xlLmxvZygndmlkZW9EaW1lbnNpb25zRGlkQ2hhbmdlJyk7XG4gICAgLy8gICAgICAgICB0aGlzLl9ldmVudC5ub3RpZnkoe1xuICAgIC8vICAgICAgICAgICAgIGV2ZW50TmFtZTogJ3ZpZGVvRGltZW5zaW9uc0RpZENoYW5nZScsXG4gICAgLy8gICAgICAgICAgICAgb2JqZWN0OiBmcm9tT2JqZWN0KHtcbiAgICAvLyAgICAgICAgICAgICAgICAgdmlldzogdmlldyxcbiAgICAvLyAgICAgICAgICAgICAgICAgZGltZW5zaW9uczogZGltZW5zaW9uc1xuICAgIC8vICAgICAgICAgICAgIH0pXG4gICAgLy8gICAgICAgICB9KTtcbiAgICAvLyAgICAgfVxuICAgIC8vIH1cblxuICAgIC8vIHB1YmxpYyB2aWRlb1ZpZXdWaWRlb09yaWVudGF0aW9uRGlkQ2hhbmdlKHZpZXc6IGFueSwgb3JpZW50YXRpb246IGFueSkge1xuICAgIC8vICAgICBjb25zb2xlLmxvZygndmlkZW9WaWV3VmlkZW9PcmllbnRhdGlvbkRpZENoYW5nZScpO1xuICAgIC8vICAgICAgICAgdGhpcy5fZXZlbnQubm90aWZ5KHtcbiAgICAvLyAgICAgICAgICAgICBldmVudE5hbWU6ICd2aWRlb1ZpZXdWaWRlb09yaWVudGF0aW9uRGlkQ2hhbmdlJyxcbiAgICAvLyAgICAgICAgICAgICBvYmplY3Q6IGZyb21PYmplY3Qoe1xuICAgIC8vICAgICAgICAgICAgICAgICB2aWV3OiB2aWV3LFxuICAgIC8vICAgICAgICAgICAgICAgICBvcmllbnRhdGlvbjogb3JpZW50YXRpb25cbiAgICAvLyAgICAgICAgICAgICB9KVxuICAgIC8vICAgICAgICAgfSk7XG4gICAgLy8gICAgIH1cbiAgICAvLyB9XG5cbiAgICBnZXQgZXZlbnRzKCk6IE9ic2VydmFibGUge1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9ldmVudDtcblxuICAgIH1cblxufVxuXG5leHBvcnQgY2xhc3MgQ2FtZXJhQ2FwdHVyZXJEZWxlZ2F0ZSBleHRlbmRzIE5TT2JqZWN0IHtcblxuICAgIHB1YmxpYyBzdGF0aWMgT2JqQ1Byb3RvY29scyA9IFtUVklDYW1lcmFDYXB0dXJlckRlbGVnYXRlXTsgLy8gZGVmaW5lIG91ciBuYXRpdmUgcHJvdG9jYWxsc1xuXG4gICAgcHJpdmF0ZSBfZXZlbnQ6IE9ic2VydmFibGU7XG5cbiAgICBwcml2YXRlIF9vd25lcjogV2Vha1JlZjxhbnk+O1xuXG4gICAgcHVibGljIHN0YXRpYyBpbml0V2l0aE93bmVyKG93bmVyOiBXZWFrUmVmPGFueT4pOiBDYW1lcmFDYXB0dXJlckRlbGVnYXRlIHtcblxuICAgICAgICBsZXQgY2FtZXJhQ2FwdHVyZXJEZWxlZ2F0ZSA9IG5ldyBDYW1lcmFDYXB0dXJlckRlbGVnYXRlKCk7XG5cbiAgICAgICAgY2FtZXJhQ2FwdHVyZXJEZWxlZ2F0ZS5fZXZlbnQgPSBEZWxlZ2F0ZUV2ZW50cy5fZXZlbnRcblxuICAgICAgICBjYW1lcmFDYXB0dXJlckRlbGVnYXRlLl9vd25lciA9IG93bmVyO1xuXG4gICAgICAgIHJldHVybiBjYW1lcmFDYXB0dXJlckRlbGVnYXRlO1xuXG4gICAgfVxuXG4gICAgLy8gcHVibGljIGNhbWVyYUNhcHR1cmVyUHJldmlld0RpZFN0YXJ0KGNhcHR1cmVyOiBhbnkpIHtcblxuICAgIC8vICAgICAgICAgdGhpcy5fZXZlbnQubm90aWZ5KHtcbiAgICAvLyAgICAgICAgICAgICBldmVudE5hbWU6ICdjYW1lcmFDYXB0dXJlclByZXZpZXdEaWRTdGFydCcsXG4gICAgLy8gICAgICAgICAgICAgb2JqZWN0OiBmcm9tT2JqZWN0KHtcbiAgICAvLyAgICAgICAgICAgICAgICAgY2FwdHVyZXI6IGNhcHR1cmVyLFxuICAgIC8vICAgICAgICAgICAgIH0pXG4gICAgLy8gICAgICAgICB9KTtcbiAgICAvLyAgICAgfVxuICAgIC8vIH1cblxuICAgIHB1YmxpYyBjYW1lcmFDYXB0dXJlckRpZFN0YXJ0V2l0aFNvdXJjZShjYXB0dXJlcjogYW55LCBzb3VyY2U6IGFueSkge1xuICAgICAgICBjb25zb2xlLmxvZygnY2FtZXJhQ2FwdHVyZXIgZGlkU3RhcnRXaXRoU291cmNlJyk7XG4gICAgICAgIHRoaXMuX2V2ZW50Lm5vdGlmeSh7XG4gICAgICAgICAgICBldmVudE5hbWU6ICdjYW1lcmFDYXB0dXJlcicsXG4gICAgICAgICAgICBvYmplY3Q6IGZyb21PYmplY3Qoe1xuICAgICAgICAgICAgICAgIGNhcHR1cmVyOiBjYXB0dXJlcixcbiAgICAgICAgICAgICAgICBzb3VyY2U6IHNvdXJjZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSk7XG4gICAgfVxuXG5cbiAgICBwdWJsaWMgY2FtZXJhQ2FwdHVyZXJXYXNJbnRlcnJ1cHRlZChjYXB0dXJlcjogYW55LCByZWFzb246IGFueSkge1xuICAgICAgICBjb25zb2xlLmxvZygnY2FtZXJhQ2FwdHVyZXJXYXNJbnRlcnJ1cHRlZCcpO1xuICAgICAgICB0aGlzLl9ldmVudC5ub3RpZnkoe1xuICAgICAgICAgICAgZXZlbnROYW1lOiAnY2FtZXJhQ2FwdHVyZXJXYXNJbnRlcnJ1cHRlZCcsXG4gICAgICAgICAgICBvYmplY3Q6IGZyb21PYmplY3Qoe1xuICAgICAgICAgICAgICAgIGNhcHR1cmVyOiBjYXB0dXJlcixcbiAgICAgICAgICAgICAgICByZWFzb246IHJlYXNvbixcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBjYW1lcmFDYXB0dXJlckRpZEZhaWxXaXRoRXJyb3IoY2FwdHVyZXI6IGFueSwgZXJyb3I6IGFueSkge1xuICAgICAgICBjb25zb2xlLmxvZygnY2FtZXJhQ2FwdHVyZXJEaWRGYWlsV2l0aEVycm9yJyk7XG4gICAgICAgIHRoaXMuX2V2ZW50Lm5vdGlmeSh7XG4gICAgICAgICAgICBldmVudE5hbWU6ICdjYW1lcmFDYXB0dXJlckRpZEZhaWxXaXRoRXJyb3InLFxuICAgICAgICAgICAgb2JqZWN0OiBmcm9tT2JqZWN0KHtcbiAgICAgICAgICAgICAgICBjYXB0dXJlcjogY2FwdHVyZXIsXG4gICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZ2V0IGV2ZW50cygpOiBPYnNlcnZhYmxlIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5fZXZlbnQ7XG5cbiAgICB9XG5cbn1cbiJdfQ==
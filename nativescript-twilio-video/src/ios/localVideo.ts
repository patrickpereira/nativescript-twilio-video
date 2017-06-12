import { View } from 'ui/core/view';
import * as utils from "tns-core-modules/utils/utils";


var app = require("application");

declare var com, TVIVideoView;
let rect = {
    origin: {
        x: 0,
        y: 0
    },
    size: {
        width: 0,
        height: 0
    }
};

// CGRect
const videoView: any = TVIVideoView.init(rect);

export class LocalVideo extends View {
    
    nativeView: UIView;
    private localVideoView: any = videoView;

    constructor() {
        super();
    }

  
    get ios(): any {

        return this.nativeView;

    }

    public createNativeView() {
        
        return UIView.new(); 

    }


    public initNativeView(): void {

        this.nativeView.insertSubviewAtIndex( this.localVideoView , 0 );

    }

    public disposeNativeView() {
        
        this.nativeView = null;

    }  

    public get_local_view(): any {

        return this.localVideoView;

    }


}
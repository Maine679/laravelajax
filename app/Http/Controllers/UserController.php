<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserModel;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index() {

        $objUser = new UserModel();
        $users = $objUser->paginate(20);

        return $users;
    }


    public function getUserByName(Request $request) {

        if(empty($request->username)) {
            return response()->json('no valid');
        }

        $objDB = new UserModel();
        if($objDB->where('username',$request->username)->first()) {
            return response()->json('no valid');
        } else {
            return response()->json('valid');
        }
    }

    public function addUser(Request $request) {

        $objUser = new UserModel();
        $objUser->username = $request->username;
        $objUser->hash_password = md5($request->password);

        $objUser->save();

        $user = UserModel::latest()->first();
        return response()->json(['msg'=>'ok','id'=>$user->id,'username'=>$user->username,'created_at'=>$user->created_at, 'updated_at'=>$user->updated_at]);
    }


    public function deleteUser(Request $request) {

        $user = UserModel::where('id', $request->id)->first();
        $user->delete();

        return response()->json(['msg'=>'true']);
    }


    public function updateUser(Request  $request) {
        $user = UserModel::where('id', $request->id)->first();

        if(!empty($request->username)) {
            $user->username = $request->username;
        }
        if(!empty($request->password)) {
            $user->hash_password = md5($request->password);
        }

        $user->save();
        $user = $user->refresh();

        return response()->json(['msg'=>'true','id'=>$user->id,'username'=>$user->username,'created_at'=>$user->created_at, 'updated_at'=>$user->updated_at]);
    }

}

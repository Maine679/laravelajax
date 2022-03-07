<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    $userController = new \App\Http\Controllers\UserController();

    $users = $userController->index();
    return view('ajax', compact('users', $users));
});


//Вот так нужно делать переадресацию на класс. Обработчик ajax
Route::post('getuserbyname', '\App\Http\Controllers\UserController@getUserByName');
//Здесь мы уже добавляем пользователя
Route::post('adduser', '\App\Http\Controllers\UserController@addUser');

//Здесь мы уже удаляем пользователя
Route::post('deleteuser', '\App\Http\Controllers\UserController@deleteUser');

Route::post('updateuser', '\App\Http\Controllers\UserController@updateUser');

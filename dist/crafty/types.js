export var Actions;
(function (Actions) {
    Actions["start"] = "start_server";
    Actions["stop"] = "stop_server";
    Actions["restart"] = "restart_server";
    Actions["kill"] = "kill_server";
    Actions["backup"] = "backup_server";
    Actions["update"] = "update_executable";
})(Actions || (Actions = {}));

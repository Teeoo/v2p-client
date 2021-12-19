import { boot } from 'quasar/wrappers';
import { LocalStorage, Notify } from 'quasar';
import { useInitStore } from 'src/store/init';
import router from 'src/router';

export default boot(({ app }) => {
    const $store = useInitStore();
    const ws = location.protocol == 'http:' ? 'ws://' : 'wss://';
    const url = process.env.wsUrl as string ?? `${ws}${location.host}/elecV2P`
    const socket = new WebSocket(`${url}?token=${LocalStorage.getItem<string>('token') ?? ''}`);
    const init = () => {
        socket.addEventListener('open', handleOpen, false);
        socket.addEventListener('close', handleClose, false);
        socket.addEventListener('error', handleError, false);
    };
    const handleOpen = () => {
        Notify.create({
            progress: true,
            position: 'bottom',
            message: '成功建立ws连接'
        });
        socket.send(JSON.stringify({ 'type': 'ready', 'data': 'init' }));
        socket.send(JSON.stringify({ 'type': 'ready', 'data': 'hold' }));
        socket.send(JSON.stringify({ 'type': 'ready', 'data': 'message' }));
        socket.send(JSON.stringify({ 'type': 'ready', 'data': 'evui' }));
        socket.send(JSON.stringify({ 'type': 'ready', 'data': 'elecV2Pstatus' }));
        socket.send(JSON.stringify({ 'type': 'ready', 'data': 'jsrunstatus' }));
        socket.addEventListener('message', (e: MessageEvent) => {
            const result = JSON.parse(e.data) as { type: string, data: { id: string, vernum: number } };
            if (result.type === 'init') {
                $store.setInitVal({ id: result.data.id, version: result.data.vernum });
                socket.send(JSON.stringify({ 'type': 'init', 'data': 'OK', 'id': result.data.id }));
                socket.send(JSON.stringify({ 'type': 'ready', 'data': 'init', 'id': result.data.id }));
                socket.send(JSON.stringify({ 'type': 'ready', 'data': 'hold', 'id': result.data.id }));
                socket.send(JSON.stringify({ 'type': 'ready', 'data': 'message', 'id': result.data.id }));
                socket.send(JSON.stringify({ 'type': 'ready', 'data': 'evui', 'id': result.data.id }));
                socket.send(JSON.stringify({ 'type': 'ready', 'data': 'elecV2Pstatus', 'id': result.data.id }));
                socket.send(JSON.stringify({ 'type': 'ready', 'data': 'jsrunstatus', 'id': result.data.id }));
            }
        });
    };

    function handleClose(e: CloseEvent) {
        Notify.create({
            progress: true,
            position: 'bottom',
            type: 'negative',
            message: e.reason
        });
        if (e.code === 4003) {
            void router.push('/login')
        }
        console.log('websocket close', e);
    }

    function handleError(e: Event) {
        Notify.create({
            progress: true,
            position: 'bottom',
            type: 'negative',
            message: 'ws已关闭'
        });
        console.log('websocket error', e);
    }

    init();

    app.provide('ws', socket);
});
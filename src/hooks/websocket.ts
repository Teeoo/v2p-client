function useWebSocket<T>(handleMessage: (this: WebSocket, ev: MessageEvent<T>) => void) {
  const ws = new WebSocket('ws://127.0.0.1:8000/elecV2P');

  const init = () => {
    ws.addEventListener('open', handleOpen, false);
    ws.addEventListener('close', handleClose, false);
    ws.addEventListener('error', handleError, false);
    ws.addEventListener('message', handleMessage, false);
  };

  function handleOpen(e: Event) {
    console.log('websocket open', e);
    ws.send(JSON.stringify({ 'type': 'ready', 'data': 'init' }));
    ws.send(JSON.stringify({ 'type': 'ready', 'data': 'hold' }));
    ws.send(JSON.stringify({ 'type': 'ready', 'data': 'message' }));
    ws.send(JSON.stringify({ 'type': 'ready', 'data': 'evui' }));
    ws.send(JSON.stringify({ 'type': 'ready', 'data': 'elecV2Pstatus' }));
    ws.send(JSON.stringify({ 'type': 'ready', 'data': 'jsrunstatus' }));
  }

  function handleClose(e: Event) {
    console.log('websocket close', e);
  }

  function handleError(e: Event) {
    console.log('websocket error', e);
  }

  init();

  return ws;
}

export { useWebSocket };


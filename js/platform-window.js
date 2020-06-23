export const CONTAINER_ID = 'layout-container';
window.addEventListener('DOMContentLoaded', () => {
    // Before .50 AI version this may throw...
    fin.Platform.Layout.init({containerId: CONTAINER_ID});
    console.log(fin)
    maxOrRestore();
});

maxOrRestore = async () => {
    if (await fin.me.getState() === 'normal') {
        return await fin.me.maximize();
    }

    return fin.me.restore();
}
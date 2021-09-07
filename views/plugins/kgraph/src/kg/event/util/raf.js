export default window.requestAnimationFrame
  ? window.requestAnimationFrame.bind(window)
  : setTimeout;
import useHttp from './use-http'

function useConfig() {
  const { execute, data } = useHttp('/v1/config', {
    method: 'POST',
  }, {
    immediate: false,
  })

  return {
    execute,
    data,
  }
}

export default useConfig

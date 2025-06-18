const {codegen} = require('swagger-axios-codegen')

codegen({
    methodNameMode: 'path',
    remoteUrl: 'http://localhost:5000/ord-doc-api/v1/plugin-api.json',
    remoteUrl2: "https://zhm8lg5d-7121.asse.devtunnels.ms/ord-doc-api/v1/plugin-api.json",
    outputDir: './src/api',
    strictNullChecks: false,
    modelMode: 'interface',
    multipleFileMode: true,
    useStaticMethod: true
})

class config {
                is_production = import.meta.env['VITE_PRODUCTION'] === 'true' ? true : false
                is_test_with_server = import.meta.env['VITE_TEST_WITH_SERVER'] === 'true' ? true : false
                all_code_each_mount = 7
                one_lang_update_mount = 8
                type_afk_limit = 10
                available_code_list: Array<string> = ['python', 'rust', 'typescript']
}

const ins = new config()
export default ins

/**
 * Copyright (c) 2016 Dynamicloud
 * <p/>
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * <p/>
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * <p/>
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * <p/>
 * This module has the necessary functions to execute save, load, update and delete operations, create query,
 * update records according to selections and delete records according to selections as well.
 *
 * This module has the properties about api configuration.
 *
 * @author Eleazar Gomez
 */

module.exports = {
    host: 'api.dynamicloud.org',
// this url must be executed using post method
    'path.get.records': '/api_models/{csk}/{aci}/get_records/{mid}/{count}/{offset}/',
// this url must be executed using post method
    'path.get.projection.fields': '/api_models/{csk}/{aci}/get_records_by_projection/{mid}/{count}/{offset}/',
// this url must be executed using post method
    'path.get.record.info': '/api_records/{csk}/{aci}/get_record_info/{mid}/{rid}',
// this url must be executed using post method
    'path.update.record': '/api_records/{csk}/{aci}/update_record/{mid}/{rid}',
// this url must be executed using post method
    'path.save.record': '/api_records/{csk}/{aci}/create_record/{mid}',
// this url must be executed using delete method
    'path.delete.record': '/api_records/{csk}/{aci}/delete_record/{mid}/{rid}',
// this url must be executed using get method
    'path.get.model.info': '/api_models/{csk}/{aci}/get_model_info/{mid}',
// this url must be executed using get method
    'path.get.models': '/api_models/{csk}/{aci}/get_models',
// this url must be executed using get method
    'path.get.fields': '/api_models/{csk}/{aci}/get_fields/{mid}',
// this url must be executed using post method
    'path.update.selection': '/api_records/{csk}/{aci}/update_using_selection/{mid}',
// this url must be executed using post method
    'path.delete.selection': '/api_records/{csk}/{aci}/delete_using_selection/{mid}',
    'version': '1.0.0'
};
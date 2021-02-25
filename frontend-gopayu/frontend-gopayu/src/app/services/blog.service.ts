import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map  } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BlogsService {

    /* Define variables */
    private httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8'
      })
    };

    constructor(private http:HttpClient) { }

    getBlogs()
    {
        return this.http.get(`${environment.apiUrl}/blogs/get-all/1000/0`, this.httpOptions)
        .pipe( map( data => data )
        );
    }
    getActivatedVideos()
    {
      return this.http.get(`${environment.apiUrl}/posts/get-videos`, this.httpOptions)
      .pipe( map( data => data )
      );
    }
    getPosts()
    {
      return this.http.get(`${environment.apiUrl}/posts/get-all/1000/0`, this.httpOptions)
        .pipe( map( data => data )
        );
    }
    getFeatured()
    {
      return this.http.get(`${environment.apiUrl}/posts/get-feature`, this.httpOptions)
        .pipe( map( data => data )
        );
    }
    getBlogsDetail(_id)
    {
        return this.http.get(`${environment.apiUrl}/posts/get-single-post/${_id}`, this.httpOptions)
        .pipe( map( data => data )
        );
    }
    getCategoryDetail(_id)
    {
        return this.http.get(`${environment.apiUrl}/posts/get-category-detail/${_id}`, this.httpOptions)
        .pipe( map( data => data )
        );
    }
    getBackground()
    {
      return this.http.get(`${environment.apiUrl}/blog/get-background`, this.httpOptions)
      .pipe( map( data => data )
      );
    }
    getLastPost()
    {
      return this.http.get(`${environment.apiUrl}/posts/get-last`, this.httpOptions)
      .pipe( map( data => data )
      );
    }
    getMostPopular()
    {
      return this.http.get(`${environment.apiUrl}/posts/get-most-popular`, this.httpOptions)
      .pipe( map( data => data )
      );
    }
    setLike(_data)
    {
      return this.http.post(`${environment.apiUrl}/posts/set-like`, JSON.stringify(_data), this.httpOptions)
      .pipe( map( data => data )
      );
    }
    setComment(id,_data)
    {
      return this.http.post(`${environment.apiUrl}/posts/set-comment/${id}`, JSON.stringify(_data), this.httpOptions)
      .pipe( map( data => data )
      );
    }
    setDisLike(_id)
    {
      return this.http.post(`${environment.apiUrl}/posts/set-dislike/${_id}`,{}, this.httpOptions)
      .pipe( map( data => data )
      );
    }


}

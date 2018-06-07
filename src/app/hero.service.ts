import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';
const httpOptions = {
	headers: new HttpHeaders({
		'Content-Type': 'application/json'
	})
};
@Injectable({
	providedIn: 'root'
})
export class HeroService {
	private heroesUrl = 'api/heroes'; // URL to web api
	constructor(
		private http: HttpClient,
		private messageService: MessageService
	) {}
	/** POST: add a new hero to the server */
	addHero(hero: Hero): Observable < Hero > {
		return this.http.post < Hero > (this.heroesUrl, hero, httpOptions).pipe(
			tap((hero: Hero) => this.log(`added hero w/ id=${hero.id}`)),
			catchError(this.handleError < Hero > ('addHero'))
		);
	}
	getHero(id: number): Observable < Hero > {
		const url = `${this.heroesUrl}/${id}`;
		this.log(`fetched hero id=${id}`);
		//		return of(HEROES.find(hero => hero.id === id));
		return this.http.get < Hero > (url).pipe(
			tap(_ => this.log(`fetched hero id=${id}`)),
			catchError(this.handleError < Hero > (`getHero id=${id}`))
		);
	}
	updateHero(hero: Hero): Observable < any > {
		return this.http.put(this.heroesUrl, hero, httpOptions).pipe(
			tap(_ => this.log(`updated hero id=${hero.id}`)),
			catchError(this.handleError < any > ('updateHero'))
		);
	}
	getHeroes(): Observable < Hero[] > {
		//		this.log('fetched heroes');
		//		return of(HEROES);
		return this.http.get < Hero[] > (this.heroesUrl)
			.pipe(
				tap(heroes => this.log(`fetched heroes`)),
				catchError(this.handleError('getHeroes', []))
			);
	}
	searchHeroes(term:string):Observable<Hero[]>{
		if(!term.trim()){
			return of([]);
		}
		return this.http.get<Hero[]>(`api/heroes/?name=${term}`)
		.pipe(
			tap(_ => this.log(`found heroes matching "${term}"`)),
			catchError(this.handleError<Hero[]>('searchHeroes',[]))
		);
	}
	deleteHero(hero: Hero | number): Observable < Hero > {
		const id = typeof hero === 'number' ? hero : hero.id;
		const url = `${this.heroesUrl}/${id}`;
		return this.http.delete < Hero > (url, httpOptions)
			.pipe(
				tap(_ => this.log(`delete hero id=${id}`)),
				catchError(this.handleError < Hero > ('deleteHero'))
			);
	}

	private handleError < T > (operation = 'operation', result ? : T) {
		return(error: any): Observable < T > => {

			// TODO: send the error to remote logging infrastructure
			console.error(error); // log to console instead

			// TODO: better job of transforming error for user consumption
			this.log(`${operation} failed: ${error.message}`);

			// Let the app keep running by returning an empty result.
			return of(result as T);
		};
	}
	private log(message: string) {
		this.messageService.add('HeroService:' + message);
	}
}
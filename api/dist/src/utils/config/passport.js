"use strict";
// import prisma from "./database";
// import bcrypt from "bcrypt";
// import passport from "passport"
// import { Strategy as JwtStrategy,ExtractJwt} from "passport-jwt";
// import {Strategy as LocalStrategy} from "passport-local";
// //Local Strategy
// passport.use('local',new LocalStrategy(
//     {usernameField:'email',passwordField:'password'},
//     async (email,password,done) => {
//         try {
//             const user = await prisma.user.findUnique({where:{email}});
//             if(!user) return done(null,false,{message:'Incorrect email or password'});
//             const isMatch = await bcrypt.compare(password,user.password);
//             if(!isMatch) return done(null,false,{message:"Incorrect email or password"});
//             return done (null,user);
//         } catch (error) {
//             return done(error);
//         }
//     }
// ));
// //JWT Strategy
// const opts = {
//   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//   secretOrKey: process.env.JWT_SECRET!,
// };
// passport.use('jwt',
//     new JwtStrategy(opts,async (jwtPayload,done) =>{
//             try {
//                 if (!jwtPayload.id) {
//                     return done(null,false)
//                 }
//                 const user = await prisma.user.findUnique(
//                     {
//                         where:{id:jwtPayload.id}
//                     }
//                 )
//                 if(!user)return done(null,false);
//                 return done(null,user);
//             } catch (error) {
//                 return done(error)
//             }
//         }
//     )
// )
// passport.serializeUser((user: any, done) => {
//       done(null, user.id);
// });
//  passport.deserializeUser(async (id: string, done) => {
//       try {
//         const user = await prisma.user.findUnique({ where: { id } });
//         done(null, user);
//       } catch (err) {
//         done(err);
//       }
// });
// // export default passport

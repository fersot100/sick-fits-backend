import Link from 'next/link';
import { Mutation } from 'react-apollo'
import NavStyles from './styles/NavStyles';
import User from './User';
import SignOut from './SignOut';
import {TOGGLE_CART_MUTATION} from './Cart'

const Nav = () => (
	<User>
		{({ data: { me } }) => (
			<NavStyles>
				{me && <p>{me.email}</p>}
				<Link href="/items">
					<a>Shop</a>
				</Link>
				{me && (
                    <>
					<Link href="/sell">
						<a>Sell</a>
					</Link>
                    <Link href="/orders">
					    <a>Orders</a>
				    </Link>
                    <Link href="/me">
                        <a>Account</a>
                    </Link>
					<Link href="/permissions">
                        <a>Permissions</a>
                    </Link>
                    <SignOut />
					<Mutation mutation={TOGGLE_CART_MUTATION} >
						{(toggleCart) => (
							<button onClick={toggleCart}>My Cart</button>
						)}
					</Mutation>
                    </>
                )}
                {!me && (
                    <Link href="/signup">
					    <a>Sign In</a>
				    </Link>
                )}
			</NavStyles>
		)}
	</User>
);

export default Nav;
